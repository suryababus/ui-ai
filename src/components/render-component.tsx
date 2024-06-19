type Props = {
  html: string;
};

export default function RenderComponent({ html }: Props) {
  return (
    <div
      className="light text-foreground w-full overflow-scroll grid place-items-center bg-muted/50 border-4 border-blue-500  min-h-96"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
