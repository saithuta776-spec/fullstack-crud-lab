import api from "../../api/index";

export const homeLoader = async () => {
  console.log("Home loader is running");

  try {
    const response = await api.get("/user/posts");
    return response.data;
  } catch (error) {
    console.log("Home Loader Error:", error);
  }
};
