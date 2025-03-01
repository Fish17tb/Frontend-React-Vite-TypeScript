import { useCurrentApp } from "components/context/app.context";

const AppHeader = () => {
  const { user } = useCurrentApp();

  return (
    <>
      <div>AppHeader</div>
      <div>{JSON.stringify(user)}</div>
    </>
  );
};

export default AppHeader;
