import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

type DetailsCard = {
  title: string;
  text: string;
  className: string;
  children: React.ReactNode;
};

export function DetailsCard({ title, text, className, children }: DetailsCard) {
  return (
    <Card className={`flex flex-col gap-2 ${className}`}>
      <CardHeader>
        <CardTitle className="text-md">{title}</CardTitle>
        <CardDescription className="text-xs">{text}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
