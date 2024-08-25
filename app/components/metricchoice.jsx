"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react"; // Assuming you have an icon library like Lucide or similar

export default function MetricChoice({
  projects,
  metrics,
  metricDomains,
  selectedMetrics,
  updateSelectedMetrics,
  submitForm,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  function toggleMetric(id) {
    const updatedMetrics = selectedMetrics.includes(id)
      ? selectedMetrics.filter((metric) => metric !== id)
      : [...selectedMetrics, id];
    updateSelectedMetrics(updatedMetrics);
  }

  function handleProjectSelect(projectId) {
    setSelectedProject(projectId);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    // api call 
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chosen_metrics: selectedMetrics }),
        }
        
    await fetch('http://localhost:3000/api/choose/'+selectedProject, options).then(response => {
        if (response.ok) {
            console.log("Metrics chosen successfully");
            submitForm(selectedProject);
        } else {
            console.error("Error choosing metrics");
        }
    });
  }

  function goToNextStep() {
    if (selectedProject) {
      setCurrentStep(2);
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="w-full">
        {/* <SelectScrollable /> */}
        {/* Step 1: Project Selection */}
        {currentStep === 1 && (
          <div className="max-w-lg mx-auto flex flex-row items-center justify-center gap-2">
            {projects.length > 0 && (
              <Select onValueChange={(value) => handleProjectSelect(value)}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem value={project.key}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {/* Right Arrow Button */}
            <Button
              className="flex items-center"
              onClick={goToNextStep}
              disabled={!selectedProject}
            >
              Next
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Metric Selection */}
        {currentStep === 2 && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold mb-4">
              Select Metrics for Project
            </h2>
            {metricDomains.map((domain) => (
              <section key={domain}>
                <h3 className="text-lg font-semibold mt-4">{domain}</h3>
                <div className="mt-4 grid lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-2 gap-2">
                  {metrics
                    .filter((metric) => metric.domain === domain)
                    .map((metric) => (
                      <div
                        className="flex items-center space-x-2 m-1"
                        key={metric.id}
                      >
                        <Checkbox
                          id={`metric-${metric.id}`}
                          checked={selectedMetrics.includes(
                            metric.id.toString()
                          )}
                          onCheckedChange={() =>
                            toggleMetric(metric.id.toString())
                          }
                        />
                        <label
                          htmlFor={`metric-${metric.id}`}
                          className="text-sm font-medium"
                        >
                          {metric.name}
                        </label>
                      </div>
                    ))}
                </div>
              </section>
            ))}
            {metrics.length > 0 && (
            //   <Button type="submit" className="mt-4 ml-auto" disabled={isLoading}>
            //     {isLoading ? "Loading..." : "Next"}
            //   </Button>
            // right aligned
            <Button
            className="flex items-center mt-4 ml-auto"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Next"}
            <ArrowRight className="ml-2" />
          </Button>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
