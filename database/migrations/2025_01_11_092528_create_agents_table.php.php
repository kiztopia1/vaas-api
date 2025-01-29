<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAgentsTable extends Migration
{
    public function up()
    {
        Schema::create('agents', function (Blueprint $table) {
            $table->id();
            $table->string('private_key');
            $table->string('public_key');
            $table->string('agent_id');
            $table->string('name');
            $table->unsignedBigInteger('admin_id'); // Foreign key to the users table
            $table->string('fee_type')->nullable();
            $table->boolean('custom_fee')->default(false);
            $table->decimal('fee', 8, 2)->nullable();
            $table->timestamps();

            // Define the foreign key constraint
            $table->foreign('admin_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('agents');
    }
}
