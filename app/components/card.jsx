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
import { Chart } from "@/app/components/chart";

export default function Metric( measurement ) {
  return (
    <Card
      className="min-w-64 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-2 whitespace-pre-wrap"
      onClick={() => {
        console.log(measurement);
      }}
    >
      <CardContent className="space-y-2">
        <CardDescription className="text-gray-500 text-sm uppercase tracking-wide">
          {measurement.description}
        </CardDescription>
        <div className="text-xl font-semibold text-gray-900">
          {
            // check if it starts with {
            measurement.history[0].value.startsWith("{")
              ? // if it starts with { , convert the string to an object and display each key-value pair
                Object.entries(JSON.parse(measurement.history[0].value)).map(
                  ([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span>{key}</span>
                      <span>{value}</span>
                    </div>
                  )
                )
              : measurement.history[0].value
          }
        </div>
      </CardContent>
    </Card>
  );
}
