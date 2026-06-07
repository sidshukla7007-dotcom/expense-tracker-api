import {
  useState,
  useEffect
} from "react";

import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

function App() {

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [expenses, setExpenses] =
    useState([]);

  const [total, setTotal] =
    useState(0);

  const [summary, setSummary] =
    useState({});

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AA336A"
  ];

  const register = async () => {

    try {

      const response =
        await axios.post(
          "http://127.0.0.1:8000/register",
          {
            username,
            password
          }
        );

      if (response.data.error) {

        alert(response.data.error);

      } else {

        alert(
          "Registration Successful"
        );
      }

    } catch (error) {

      console.log(error);

      alert("Registration Failed");
    }
  };

  const login = async () => {

    try {

      const response =
        await axios.post(
          "http://127.0.0.1:8000/login",
          {
            username,
            password
          }
        );

      if (response.data.error) {

        alert(response.data.error);

      } else {

        localStorage.setItem(
          "token",
          response.data.access_token
        );

        setIsLoggedIn(true);

        fetchExpenses();
        fetchTotal();
        fetchSummary();

        alert("Login Successful");
      }

    } catch (error) {

      console.log(error);

      alert("Login Failed");
    }
  };

  const logout = () => {

    localStorage.removeItem("token");

    setIsLoggedIn(false);
  };

  const addExpense = async () => {

    try {

      await axios.post(
        "http://127.0.0.1:8000/expenses",
        {
          title,
          amount: parseInt(amount),
          category
        }
      );

      setTitle("");
      setAmount("");
      setCategory("");

      fetchExpenses();
      fetchTotal();
      fetchSummary();

    } catch (error) {

      console.log(error);

      alert("Failed to add expense");
    }
  };

  const fetchExpenses = async () => {

    try {

      const response =
        await axios.get(
          "http://127.0.0.1:8000/expenses"
        );

      setExpenses(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const fetchTotal = async () => {

    try {

      const response =
        await axios.get(
          "http://127.0.0.1:8000/total"
        );

      setTotal(
        response.data.total_expense
      );

    } catch (error) {

      console.log(error);
    }
  };

  const fetchSummary = async () => {

    try {

      const response =
        await axios.get(
          "http://127.0.0.1:8000/category-summary"
        );

      setSummary(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const deleteExpense = async (id) => {

    try {

      await axios.delete(
        `http://127.0.0.1:8000/expenses/${id}`
      );

      fetchExpenses();
      fetchTotal();
      fetchSummary();

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    if (
      localStorage.getItem("token")
    ) {

      setIsLoggedIn(true);

      fetchExpenses();
      fetchTotal();
      fetchSummary();
    }

  }, []);

  const chartData =
    Object.entries(summary).map(
      ([key, value]) => ({
        name: key,
        value: value
      })
    );

  if (!isLoggedIn) {

    return (

      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(to right, #667eea, #764ba2)"
        }}
      >

        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "10px",
            width: "350px",
            boxShadow:
              "0 0 15px rgba(0,0,0,0.2)"
          }}
        >

          <h1
            style={{
              textAlign: "center"
            }}
          >
            Expense Tracker
          </h1>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px"
            }}
          />

          <button
            onClick={login}
            style={{
              width: "100%",
              padding: "12px",
              background: "#667eea",
              color: "white",
              border: "none",
              marginBottom: "10px",
              cursor: "pointer"
            }}
          >
            Login
          </button>

          <button
            onClick={register}
            style={{
              width: "100%",
              padding: "12px",
              background: "#764ba2",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            Register
          </button>

        </div>

      </div>
    );
  }

  return (

    <div
      style={{
        padding: "30px",
        background: "#f5f6fa",
        minHeight: "100vh",
        fontFamily: "Arial"
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center"
        }}
      >

        <h1>
          Expense Dashboard
        </h1>

        <button
          onClick={logout}
          style={{
            padding: "10px 20px",
            background: "red",
            color: "white",
            border: "none"
          }}
        >
          Logout
        </button>

      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px"
        }}
      >

        <h2>
          Total Expense: ₹{total}
        </h2>

      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          flexWrap: "wrap"
        }}
      >

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            flex: 1
          }}
        >

          <h2>Add Expense</h2>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px"
            }}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px"
            }}
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px"
            }}
          />

          <button
            onClick={addExpense}
            style={{
              width: "100%",
              padding: "12px",
              background: "#00b894",
              color: "white",
              border: "none"
            }}
          >
            Add Expense
          </button>

        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            flex: 1
          }}
        >

          <h2>Expense Summary</h2>

          <PieChart
            width={350}
            height={300}
          >

            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >

              {chartData.map(
                (entry, index) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                        COLORS.length
                      ]
                    }
                  />
                )
              )}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </div>

      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px"
        }}
      >

        <h2>Expense List</h2>

        {expenses.map((expense) => (

          <div
            key={expense.id}
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              padding: "15px",
              borderBottom:
                "1px solid #ddd"
            }}
          >

            <div>

              <h3>
                {expense.title}
              </h3>

              <p>
                ₹{expense.amount}
              </p>

              <p>
                {expense.category}
              </p>

            </div>

            <button
              onClick={() =>
                deleteExpense(
                  expense.id
                )
              }
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding:
                  "10px 15px"
              }}
            >
              Delete
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default App;

