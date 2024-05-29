document.addEventListener("DOMContentLoaded", () => {
  let socket;
  const loginContainer = document.querySelector(".login-container");
  const chatContainer = document.querySelector(".chat-container");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("login-btn");
  const singleChatBtn = document.getElementById("single-chat-btn");
  const groupChatBtn = document.getElementById("group-chat-btn");
  const createGroupBtn = document.getElementById("create-group-btn");
  const listGroupsBtn = document.getElementById("list-groups-btn");
  const messagesDiv = document.getElementById("messages");
  const messageInput = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");

  let currentRoom = "";
  let token = "";
  let currentFriendId = "";
  let currentGroupId = "";

  // Retrieve token from localStorage if available
  token = localStorage.getItem("token");

  loginBtn.addEventListener("click", async () => {
    const email = usernameInput.value;
    const password = passwordInput.value;

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      token = data.token;
      localStorage.setItem("token", token); // Save token to localStorage
      loginContainer.style.display = "none";
      chatContainer.style.display = "block";
      initializeSocket();
    } else {
      alert("Login failed");
    }
  });

  async function fetchGroups() {
    const response = await fetch("/api/groups", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const groups = await response.json();
      return groups;
    } else {
      alert("Failed to fetch groups");
    }
  }

  createGroupBtn.addEventListener("click", createGroup);

  async function createGroup() {
    const groupName = prompt("Enter group name:");
    const response = await fetch("/api/groups/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: groupName }),
    });

    if (response.ok) {
      const group = await response.json();
      alert(`Group created with ID: ${group._id}`);
    } else {
      alert("Failed to create group");
    }
  }

  // Define the joinGroup function to send a request to join the group
  async function joinGroup(currentGroupId) {
    if (currentGroupId) {
      try {
        const response = await fetch("/api/groups/join", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the JWT token in the headers
          },
          body: JSON.stringify({ groupId: currentGroupId }), // Send the group ID in the request body
        });

        if (response.ok) {
          const group = await response.json();
          alert(`Joined group: ${group.name}`);
        } else {
          const errorMessage = await response.text();
          alert(`Failed to join group: ${errorMessage}`);
        }
      } catch (error) {
        console.error("Error joining group:", error);
        alert("An error occurred while joining the group. Please try again.");
      }
    }
  }

  // socket connection initialization
  function initializeSocket() {
    socket = io({ auth: { token } });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("loadMessages", (messages) => {
      messagesDiv.innerHTML = ""; 
      messages.forEach((message) =>
        addMessageToUI(`User ${message.username}: ${message.message}`)
      );
    });

    socket.on("receiveSingleMessage", ({ username, message }) => {
      addMessageToUI(`User ${username}: ${message}`);
    });

    socket.on("receiveGroupMessage", ({ username, message }) => {
      addMessageToUI(`User ${username} in group: ${message}`);
    });

    singleChatBtn.addEventListener("click", () => {
      currentRoom = "single";
      currentFriendId = prompt("Enter friend ID:");
      socket.emit("joinSingleChat", { friendId: currentFriendId });
    });

    groupChatBtn.addEventListener("click", () => {
      currentRoom = "group";
      currentGroupId = prompt("Enter group ID:");
      socket.emit("joinGroupChat", { groupId: currentGroupId });
      joinGroup(currentGroupId); 
    });



    // Handle sending messages
    sendBtn.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        sendMessage();
      }
    });

    function sendMessage() {
      const message = messageInput.value.trim();
      if (message) {
        if (currentRoom === "single") {
          socket.emit("sendSingleMessage", {
            friendId: currentFriendId,
            message,
          });
        } else if (currentRoom === "group") {
          socket.emit("sendGroupMessage", { groupId: currentGroupId, message });
        }
        messageInput.value = "";
        addMessageToUI(`You: ${message}`);
      }
    }

    function addMessageToUI(message) {
      const messageElement = document.createElement("div");
      messageElement.textContent = message;
      messagesDiv.appendChild(messageElement);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }
});
