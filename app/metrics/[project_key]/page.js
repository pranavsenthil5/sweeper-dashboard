"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { useState, useEffect } from "react";
async function getMetrics() {
  const response = await fetch("http://localhost:3000/api/metrics/", {
    mode: "cors",
  });
  console.log("metrics response", response);
  const data = await response.json();
  console.log("data", data);
  return data?.metrics || [];
}

async function getChosenMetrics(projectKey) {
  const response = await fetch(
    "http://localhost:3000/api/chosen/" + projectKey,
    { mode: "cors" }
  );
  console.log("chosen response", response);
  const data = await response.json();
  console.log("data", data);
  return data?.metrics || [];
}

async function getMetricKeys(metrics, projectKey) {
  var chosenMetrics = await getChosenMetrics(projectKey);
  console.log("PRANAV");
  console.log("metrics", metrics);
  console.log("chosenMetrics", chosenMetrics);

  var filteredMetrics = metrics.filter((metric) =>
    chosenMetrics.includes(metric.id)
  );

  var metricKeys = filteredMetrics.map((metric) => metric.key);

  console.log("metricKeys", metricKeys);

  return metricKeys;
}

async function getMeasurements(projectKey) {
  var metrics = await getMetrics();
  var metricKeys = await getMetricKeys(metrics, projectKey);

  var metricKeysString = metricKeys.join(",");

  var options = {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(
    "http://localhost:3000/api/measures/" +
      projectKey +
      "?metric_keys=" +
      metricKeysString,
    options
  );

  const data = await response.json();
  console.log("data", data);

  const data_with_name = data?.measures.map((measure) => {
    var metric = metrics.find((metric) => metric.key === measure.metric);
    return {
      ...measure,
      name: metric.name,
      description: metric.description,
      domain: metric.domain,
    };
  });

  console.log("data_with_name", data_with_name);

  return data_with_name;
}

export default function Page({ params }) {
  const [measurements, setMeasurements] = useState([]);
  useEffect(() => {
    var data = getMeasurements(params.project_key);
    data.then((measurements) => {
      setMeasurements(measurements);
    });
  }, [params.project_key]);

  return (
    <>
      <div className="p-4 flex flex-col space-y-4">
        {measurements.length > 0 &&
          measurements.map((measurement) => {
            return (
              <>
                {/* find the unique  */}
                {measurement.history[0].value && (
                  <Card className="w-64 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 whitespace-pre-wrap">
                    <CardContent className="space-y-2">
                      <CardDescription className="text-gray-500 text-sm uppercase tracking-wide">
                        {measurement.description}
                      </CardDescription>
                      <div className="text-xl font-semibold text-gray-900">
                        {
                          // check if it starts with {
                          measurement.history[0].value.startsWith("{")
                            ? // if it starts with { , convert the string to an object and display each key-value pair
                              Object.entries(
                                JSON.parse(measurement.history[0].value)
                              ).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span>{key}</span>
                                  <span>{value}</span>
                                </div>
                              ))
                            : measurement.history[0].value
                        }
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            );
          })}
      </div>
    </>
  );
}
