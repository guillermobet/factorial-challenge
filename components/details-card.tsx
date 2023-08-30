import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Separator } from "./ui/separator";

type DetailsCard = {
  title: string;
  text: string;
  className: string;
  children: React.ReactNode;
};

export function DetailsCard({ title, text, className, children }: DetailsCard) {
  return (
    <Card
      className={`flex flex-col ${className}`}
      style={{
        boxShadow: "inset 0 -10px 10px -10px #454545",
        MozBoxShadow: "inset 0 -10px 10px -10px #454545",
        WebkitBoxShadow: "inset 0 -10px 10px -10px #454545",
      }}
    >
      <CardHeader>
        <CardTitle className="text-md">{title}</CardTitle>
        <CardDescription className="pb-2 text-xs">{text}</CardDescription>
        <Separator className="my-0 py-0" />
      </CardHeader>

      <CardContent
        style={{
          flex: "1 1 auto",
          overflowY: "auto",
          height: 0,
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}
