// import cors from 'cors';
import packageData from "../../../package.json";

const REPLICATE_API_HOST = "https://api.replicate.com";
// const corsMiddleware = cors({
//   origin: '*', // Replace '*' with a list of allowed origins
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// });

export default async function handler(req, res) {
  // await corsMiddleware(req, res);
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.");
  }

  const body = JSON.stringify({
    // https://replicate.com/jagilley/controlnet-scribble/versions
    version: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
    input: req.body,
  });

  const headers = {
    Authorization: `Token f98e4afbb9d359074cd181f136edac871ea9dc24`,
    "Content-Type": "application/json",
    "User-Agent": `${packageData.name}/${packageData.version}`
  }

  // Add the cors middleware
  // await cors()(req, res);

  const response = await fetch(`${REPLICATE_API_HOST}/v1/predictions`, {
    method: "POST",
    headers,
    body,
  });

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};