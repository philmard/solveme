const app = express();
const { fetchProblems, fetchAllProblems } = require("./routes");

const port = 3000;

app.get("/fetchProblems", fetchProblems);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
