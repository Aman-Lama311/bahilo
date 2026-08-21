interface PageHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export const PageHeader = ({ title, action }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-6 pt-2 pb-4">
      <h2 className="text-foreground">{title}</h2>
      {action}
    </div>
  );
};