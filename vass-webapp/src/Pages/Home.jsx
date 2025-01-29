import React, { useState } from "react";
import ProperyKB from "./ProperyKB";
import PropertiesList from "../components/PropertiesList";
import "./Home.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Single Listing");
  const [id, setId] = useState(null);
  const [nickname, setNickname] = useState(null);

  const renderContent = () => {
    if (activeTab === "Single Listing") {
      return (
        <div>
          <PropertiesList setId={setId} setNickname={setNickname} />
          {id === null ? (
            <div className="select-propery-warning">
              <p>
                Please select a listing to manage listing-specific knowledge
                base items.
              </p>
            </div>
          ) : (
            <ProperyKB id={id} nickname={nickname} />
          )}
        </div>
      );
    } else if (activeTab === "Global") {
      return (
        <div>
          <ProperyKB id={"1"} nickname={"Global Context"} />
        </div>
      );
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-brand-dark">
          Knowledge Base Manager
        </h1>
        <p className="text-brand-dark/70">
          Manage property-specific knowledge bases
        </p>
      </div>
      <div className="flex space-x-2 mb-6">
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "Single Listing"
              ? "bg-brand-dark text-white"
              : "bg-brand-light/10 text-brand-dark hover:bg-brand-light/20"
          }`}
          onClick={() => setActiveTab("Single Listing")}
        >
          Single Listing
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "Global"
              ? "bg-brand-dark text-white"
              : "bg-brand-light/10 text-brand-dark hover:bg-brand-light/20"
          }`}
          onClick={() => setActiveTab("Global")}
        >
          Global
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>{renderContent()}</div>
    </div>
  );
}
