import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export interface StatCartProps {
  title: string;
  value: string | number;
  change?: string;
  changeType: "positive" | "negative";
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  bgColor?: string;
}

export function StatCard({ bgColor, change, changeType, color, icon: Icon, title, value }: StatCartProps) {
  return (
    <Card key={title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-sm font-medium text-gray-600 mb-1">{title}</h2>
          <p className="text-2xl font-bold text-gray-900 mb-3">{value}</p>
          <div className="flex items-center">
            {changeType === "positive" ? (
              <ArrowUpRight className="size-4 text-emerald-500" />
            ) : (
              <ArrowDownRight className="size-4 text-red-500" />
            )}
            {change && (
              <>
                <span
                  className={`text-sm font-medium ml-1 ${changeType === "positive" ? "text-emerald-600" : "text-red-600"
                    }`}
                >
                  {change}
                </span>
                <span className="text-sm text-gray-500 ml-1">em relação ao dia anterior</span>
              </>
            )}
          </div>
        </div>
        <div className={`size-12 mt-1 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`size-6 ${color}`} />
        </div>
      </CardContent>
    </Card>
  )
}