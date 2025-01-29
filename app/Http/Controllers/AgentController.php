<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class AgentController extends Controller
{
    // Get all agents owned by the logged-in user
    public function index()
    {
        $agents = Agent::where('admin_id', Auth::id())->get();
        return response()->json($agents);
    }

    // Get a specific agent by ID (only if the logged-in user is the owner)
    public function show($id)
    {
        $agent = Agent::where('id', $id)->where('admin_id', Auth::id())->first();

        if (!$agent) {
            return response()->json(['error' => 'Agent not found or unauthorized access'], 403);
        }

        return response()->json($agent);
    }

    // Create a new agent (auto-assigns logged-in user as admin_id)
    public function store(Request $request)
    {
        $request->validate([
            'private_key' => 'required|string',
            'public_key' => 'required|string',
            'agent_id' => 'required|string|unique:agents,agent_id',
            'name' => 'required|string',
            'fee_type' => 'nullable|string',
            'custom_fee' => 'nullable|boolean',
            'fee' => 'nullable|numeric',
        ]);

        $agent = Agent::create([
            'private_key' => $request->private_key,
            'public_key' => $request->public_key,
            'agent_id' => $request->agent_id,
            'name' => $request->name,
            'admin_id' => Auth::id(), // Only the logged-in user can create an agent
            'fee_type' => $request->fee_type,
            'custom_fee' => $request->custom_fee ?? false,
            'fee' => $request->fee,
        ]);

        return response()->json($agent, 201);
    }

    // Update an existing agent (only if the logged-in user is the owner)
    public function update(Request $request, $id)
    {
        $agent = Agent::where('id', $id)->where('admin_id', Auth::id())->first();

        if (!$agent) {
            return response()->json(['error' => 'Agent not found or unauthorized access'], 403);
        }

        $request->validate([
            'private_key' => 'sometimes|string',
            'public_key' => 'sometimes|string',
            'agent_id' => 'sometimes|string|unique:agents,agent_id,' . $id,
            'name' => 'sometimes|string',
            'fee_type' => 'nullable|string',
            'custom_fee' => 'nullable|boolean',
            'fee' => 'nullable|numeric',
        ]);

        $agent->update($request->all());

        return response()->json($agent);
    }

    // Delete an agent (only if the logged-in user is the owner)
    public function destroy($id)
    {
        $agent = Agent::where('id', $id)->where('admin_id', Auth::id())->first();

        if (!$agent) {
            return response()->json(['error' => 'Agent not found or unauthorized access'], 403);
        }

        $agent->delete();

        return response()->json(['message' => 'Agent deleted successfully'], 204);
    }

    // Get all agents owned by the logged-in user (alternative method for ownership filtering)
    public function getAgentsByOwner()
    {
        $agents = Agent::where('admin_id', Auth::id())->get();
        return response()->json($agents);
    }

    public function fetchMetrics($agentId)
    {
        $vapiUrl = "https://api.vapi.ai/call";

        // Find agent in the database
        $agent = Agent::find($agentId);

        if (!$agent) {
            return response()->json(['success' => false, 'error' => 'Agent not found'], 404);
        }

        $privateKey = $agent->private_key;
        $agent_id = $agent->agent_id;
        $custom_fee = $agent->custom_fee;
        $fee_type = $agent->fee_type;
        $fee = $agent->fee;

        if (!$privateKey || !$agent_id) {
            return response()->json(['success' => false, 'error' => 'Invalid agent data'], 400);
        }

        try {
            // Fetch call data from VAPI
            $vapiResponse = Http::withHeaders([
                'Authorization' => "Bearer {$privateKey}"
            ])->withOptions(['verify' => false])->get("{$vapiUrl}?assistantId={$agent_id}");

            if ($vapiResponse->failed()) {
                return response()->json(['success' => false, 'error' => 'Failed to fetch call data from VAPI'], 500);
            }

            $callData = $vapiResponse->json();

            // Handle case where no call data exists
            if (empty($callData) || !is_array($callData)) {
                return response()->json([
                    'success' => true,
                    'metrics' => [
                        'totalCalls' => 0,
                        'totalMinutes' => "0.00",
                        'totalCost' => "0.00",
                        'avgCostPerCall' => "0.00"
                    ]
                ]);
            }

            // Calculate total calls, total minutes, and total cost
            $totalCalls = count($callData);
            $totalMinutes = 0;
            $totalCost = 0;

            foreach ($callData as $call) {
                if (isset($call['startedAt']) && isset($call['endedAt'])) {
                    $startedAt = strtotime($call['startedAt']);
                    $endedAt = strtotime($call['endedAt']);

                    if ($startedAt && $endedAt) {
                        $totalMinutes += ($endedAt - $startedAt) / 60; // Convert to minutes
                    }
                }

                // Extract cost if available
                $totalCost += $call['cost'] ?? 0;
            }

            $avgCostPerCall = $totalCalls > 0 ? $totalCost / $totalCalls : 0;

            // Apply custom fee calculations
            if ($custom_fee) {
                if ($fee_type === 'min') {
                    $totalCost = $totalMinutes * $fee;
                } elseif ($fee_type === 'call') {
                    $totalCost = $totalCalls * $fee;
                }
                $avgCostPerCall = $totalCalls > 0 ? $totalCost / $totalCalls : 0;
            }

            return response()->json([
                'success' => true,
                'metrics' => [
                    'totalCalls' => $totalCalls,
                    'totalMinutes' => number_format($totalMinutes, 2),
                    'totalCost' => number_format($totalCost, 2),
                    'avgCostPerCall' => number_format($avgCostPerCall, 2),
                    'name' => $agent->name
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function fetchCallLogs($agentId)
    {


        // Find agent in the database
        $agent = Agent::find($agentId);

        if (!$agent) {
            return response()->json(['success' => false, 'error' => 'Agent not found'], 404);
        }

        $privateKey = $agent->private_key;
        $agent_id = $agent->agent_id;

        if (!$privateKey || !$agent_id) {
            return response()->json(['success' => false, 'error' => 'Invalid agent data'], 400);
        }

        try {
            // Fetch call logs from VAPI API
            $vapiResponse = Http::withHeaders([
                'Authorization' => "Bearer {$privateKey}"
            ])->withOptions(['verify' => false])->get("https://api.vapi.ai/call?assistantId={$agent_id}");

            if ($vapiResponse->failed()) {
                return response()->json(['success' => false, 'error' => 'Failed to fetch call data from VAPI'], 500);
            }

            $callData = $vapiResponse->json();

            // Transform the call logs
            $transformedLogs = array_map(function ($call) {
                return [
                    'id' => $call['id'],
                    'assistant' => $call['assistantId'] ?? "Unknown",
                    'type' => $call['type'] ?? "Web",
                    'cost' => isset($call['cost']) ? number_format($call['cost'], 2) : "0.00",
                    'endedReason' => $call['endedReason'] ?? "Unknown",
                    'phoneNumber' => $call['phoneNumber'] ?? "No Number Connected",
                    'customer' => $call['customer'] ?? "Empty",
                    'startedAt' => isset($call['startedAt']) ? date("Y-m-d H:i:s", strtotime($call['startedAt'])) : "Unknown",
                    'endedAt' => isset($call['endedAt']) ? date("Y-m-d H:i:s", strtotime($call['endedAt'])) : "Unknown",
                    'duration' => isset($call['startedAt'], $call['endedAt']) ?
                        round((strtotime($call['endedAt']) - strtotime($call['startedAt'])) / 60) . " min" : "Unknown"
                ];
            }, $callData);

            return response()->json(['success' => true, 'callLogs' => $transformedLogs]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }


    public function fetchCallLogDetails($agentId, $callId)
    {
        // Find agent in the database
        $agent = Agent::find($agentId);

        if (!$agent) {
            return response()->json(['success' => false, 'error' => 'Agent not found'], 404);
        }

        $privateKey = $agent->private_key;
        $agent_id = $agent->agent_id;

        if (!$privateKey || !$agent_id) {
            return response()->json(['success' => false, 'error' => 'Invalid agent data'], 400);
        }

        try {
            // Fetch call details from VAPI
            $vapiResponse = Http::withHeaders([
                'Authorization' => "Bearer {$privateKey}"
            ])->withOptions(['verify' => false])->get("https://api.vapi.ai/call/{$callId}?assistantId={$agent_id}");

            if ($vapiResponse->failed()) {
                return response()->json(['success' => false, 'error' => 'Failed to fetch call details'], 500);
            }

            $callDetails = $vapiResponse->json();

            // Format the response
            return response()->json([
                'success' => true,
                'callDetails' => [
                    'logs' => $callDetails['messages'] ?? [],
                    'transcript' => $callDetails['transcript'] ?? null,
                    'analysis' => $callDetails['analysis'] ?? null,
                    'messages' => $callDetails['messages'] ?? [],
                    'costBreakdown' => $callDetails['costBreakdown'] ?? null,
                    'summary' => $callDetails['summary'] ?? null,
                    'recordingUrl' => $callDetails['recordingUrl'] ?? null,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
