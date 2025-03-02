import { Outlet } from "react-router-dom";
import AppHeader from "components/layout/app.header";
import { useEffect } from "react";
import { fetchAccountAPI } from "services/api";
import { useCurrentApp } from "components/context/app.context";
import { BounceLoader } from "react-spinners";

const Layout = () => {
  const { setIsAuthenticated, setUser, isAppLoading, setIsAppLoading } =
    useCurrentApp();

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountAPI();
      // console.log("ck-fetchAccount", res);
      if (res && res.data) {
        setIsAuthenticated(true);
        setUser(res.data.user);
      }
      setIsAppLoading(false);
    };

    fetchAccount();
  }, []);

  return (
    <>
      {isAppLoading === false ? (
        <div>
          <AppHeader />
          <Outlet />
        </div>
      ) : (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <BounceLoader size={60} color="#0652DD" />
        </div>
      )}
    </>
  );
};

export default Layout;
