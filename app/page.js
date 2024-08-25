"use client";

import { useState, useEffect } from "react";
import MetricChoice from "./components/MetricChoice";
import { redirect } from "next/navigation";

export default function Home() {
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [projects, setProjects] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [metricDomains, setMetricDomains] = useState([]);
  const [submit, setSubmit] = useState("");

  function submitForm(projectKey) {
    console.log("submitting form with project key:", projectKey);
    setSubmit(projectKey);
  }

  useEffect(() => {
    fetchProjects();
    fetchMetrics();
  }, []);

  useEffect(() => {
    if (submit !== "") {
      redirect("/metrics/"+submit);
    }
  });

  function updateSelectedMetrics(selectedMetricsList) {
    setSelectedMetrics(selectedMetricsList);
  }

  async function fetchProjects() {
    try {
      const response = await fetch("http://localhost:3000/api/projects", { mode: "cors" });
      const data = await response.json();
      setProjects(data?.components || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  async function fetchMetrics() {
    try {
      const response = await fetch("http://localhost:3000/api/metrics", { mode: "cors" });
      const data = await response.json();
      const fetchedMetrics = data?.metrics.map((metric) => ({
        id: metric.id,
        name: metric.name,
        domain: metric.domain,
      })) || [];

      setMetrics(fetchedMetrics);

      const uniqueDomains = [...new Set(fetchedMetrics.map((metric) => metric.domain))];
      setMetricDomains(uniqueDomains);

      const importantIdsString = [
        "428", "350", "351", "423", "319", "352", "317", "318", "354", // Security
        "308", "309", "315", "421", "313", // Reliability
        "306", "289", "163", "422", // Maintainability
        "78", "79", "277", // Critical Issues
      ];
      setSelectedMetrics(importantIdsString);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  }

  return (
    <main className="p-4 max-h-screen">
      {/* {projects.map((project) => (
        <div key={project.id}>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
      ))}
      {metrics.map((metric) => (
        <div key={metric.id}>
          <h2>{metric.name}</h2>
          <p>{metric.domain}</p>
        </div>
      ))} */}
      {(projects.length > 0 && metrics.length > 0 ) ? (
        <MetricChoice
          projects={projects}
          metrics={metrics}
          metricDomains={metricDomains}
          selectedMetrics={selectedMetrics}
          updateSelectedMetrics={updateSelectedMetrics}
          submitForm={submitForm}
        />
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}
