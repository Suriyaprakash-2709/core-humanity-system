
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  change?: number;
  className?: string;
  iconColor?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  change,
  className,
  iconColor = "text-primary",
}: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={cn("p-2 rounded-full bg-primary/10", iconColor)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {typeof change !== 'undefined' && (
          <div
            className={cn(
              "text-xs font-medium mt-2",
              change > 0 ? "text-green-500" : "text-red-500"
            )}
          >
            {change > 0 ? "+" : ""}
            {change}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
