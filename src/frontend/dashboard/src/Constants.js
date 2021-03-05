export const DashboardInfo = {
  title: "Recko Accounting Dashboard",
  description:
    "Unified portal to view and analyze data from multiple accounting services.",
};

const dev = {
  url: {
    API_HOST: "",
    API_ENDPOINT: "",
  },
};

const prod = {
  url: {
    API_HOST: "",
    API_ENDPOINT: "",
  },
};

export const config = process.env.NODE_ENV === "development" ? dev : prod;
//export const config = prod;
