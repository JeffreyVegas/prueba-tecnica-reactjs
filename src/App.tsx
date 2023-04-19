import { useEffect, useRef, useState } from "react";
import "./App.css";

import { type User } from "./interfaces";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const prevUsersRef = useRef<User[]>([]);
  const initUsersRef = useRef<User[]>([]);

  const [showColorRow, setShowColorRow] = useState<Boolean>(false);
  const [sorting, setSorting] = useState(false);

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=100")
      .then((res) => res.json())
      .then((res) => {
        initUsersRef.current = res.results;
        setUsers(res.results);
      });
  }, []);

  const sortByCountry = () => {
    const UsersByCountry = JSON.parse(JSON.stringify(users)).sort(
      (user1: User, user2: User) => {
        return user1.location.country.localeCompare(user2.location.country);
      }
    );
    prevUsersRef.current = users;
    setUsers(UsersByCountry);
  };

  const changePrevUsers = () => {
    setUsers(prevUsersRef.current);
  };

  const deleteUser = (user: User, index: Number) => {
    const newUsers = JSON.parse(JSON.stringify(users));
    prevUsersRef.current = prevUsersRef.current.filter((user2) => {
      return user2.login.uuid !== user.login.uuid;
    });
    newUsers.splice(index, 1);
    setUsers(newUsers);
  };

  const reset = () => {
    setUsers(initUsersRef.current);
    initUsersRef.current = [];
    setSorting(false);
  };

  return (
    <div className="App">
      <div>
        <p>{users.length} users</p>
      </div>
      <div>
        <button
          onClick={() => {
            setShowColorRow((prev) => !prev);
          }}
        >
          {showColorRow ? "hide color row" : "show color row"}
        </button>
        <button
          onClick={() => {
            setSorting(!sorting);
            sorting ? changePrevUsers() : sortByCountry();
          }}
        >
          {sorting ? "reset" : "sort by Country"}
        </button>
        <button onClick={reset}>reboot </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>photo</th>
            <th>Name</th>
            <th>Last Name</th>
            <th>country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.login.uuid}
              style={
                showColorRow
                  ? index % 2 == 0
                    ? { background: "#333" }
                    : { background: "#555" }
                  : {}
              }
            >
              <td>
                <div style={{ width: "30px", height: "30px" }}>
                  <img
                    src={user.picture.thumbnail}
                    alt=""
                    style={{ width: "100%" }}
                  />
                </div>
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button
                  onClick={() => {
                    deleteUser(user, index);
                  }}
                >
                  delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
