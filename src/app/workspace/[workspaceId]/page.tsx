interface WorkspaceIdPageProps {
  params: {
    workspaceId: string;
  };
};

const WorkspaceIdPage = ({ params }: WorkspaceIdPageProps) => {
  return (
    <div>
      <h1>Workspace</h1>
      <p>Workspace ID: {params.workspaceId}</p>
    </div>
  );
}

export default WorkspaceIdPage;
