// import.meta.env is how vite exposes environment var to browser code
// we use BASE so we don't have to repeat the full URL
// BASE URL is where we send api requests
const BASE = import.meta.env.VITE_API_URL;

// this asynchronous function handles responses and errors
async function handle(res) {
  // Convert non-2xx into errors with body text for debugging
  if (!res.ok) {
    // res is a response object from fetch()
    // text reads the body to include error message from flask
    const text = await res.text().catch(() => "");
    // throw error to component to propagate it
    throw new Error(`${res.status} ${res.statusText} ${text}`.trim());
  }
  // Handle 204 No Content
  if (res.status === 204) return null;
  // Parse JSON
  return res.json();
}
// every API call will end with .then(handle) so this keeps all error handling and JSON parsing in one place

// Simple helpers for HTTP verbs
// calls fetch()
export const get  = (path, init) => fetch(`${BASE}${path}`, { ...init }).then(handle);

//calls fetch() to force delete
export const del  = (path, init) => fetch(`${BASE}${path}`, { method: "DELETE", ...init }).then(handle);

// for creating obj
export const post = (path, body)  =>
  fetch(`${BASE}${path}`, {
    method: "POST", //sets POST method
    headers: { "Content-Type": "application/json" }, //set JSON header so Flask knows to parse JSON
    body: JSON.stringify(body), //converts JS object to JSON string
  }).then(handle); // error handling

  // for modifying obj
export const patch = (path, body) =>
  fetch(`${BASE}${path}`, {
    method: "PATCH",// sets PATCH method
    headers: { "Content-Type": "application/json" }, // sets JSON header so Flask knows to parse JSON
    body: JSON.stringify(body), // converts JS obj to JSON string
  }).then(handle); // handle errors



// Domain-specific calls
// functions the components will call
export const api = {
  listHabits:   ()             => get("/habits"),
  createHabit:  (payload)      => post(`/habits`, payload),
  updateHabit:  (id, payload)  => patch(`/habits/${id}`, payload),
  deleteHabit:  (id)           => del(`/habits/${id}`),

  listLogs:     ()             => get("/habit_logs"),
  createLog:    (payload)      => post(`/habit_logs`, payload),
  updateLog:    (id, payload)  => patch(`/habit_logs/${id}`, payload),
  deleteLog:    (id)           => del(`/habit_logs/${id}`),
};
