const contactForm = document.getElementById("contactForm");
const contactList = document.getElementById("contactList");
const searchInput = document.getElementById("search");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const contactIdInput = document.getElementById("contactId");
let contacts = [];

async function loadContacts() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();

    contacts = data.map((user) => ({
      id: user.id,
      name: user.name,
      phone: user.phone,
    }));

    renderContacts(contacts);
  } catch (error) {
    alert("Failed to load contacts");
  }
}
// Render contacts

function renderContacts(data) {
  contactList.innerHTML = "";

  if (data.length === 0) {
    contactList.innerHTML =
      "<li class='list-group-item text-center'>No contacts found</li>";
    return;
  }

  data.forEach((contact) => {
    const li = document.createElement("li");
    li.className = "list-group-item";

    li.innerHTML = `
      <div>
        <strong>${contact.name}</strong><br>
        <small>${contact.phone}</small>
      </div>
      <div>
        <button class="btn btn-warning btn-sm me-1" onclick="editContact(${contact.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteContact(${contact.id})">Delete</button>
      </div>
    `;

    contactList.appendChild(li);
  });
}

// Add or update contacts
contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const id = contactIdInput.value;
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !phone) {
    alert("All fields are required");
    return;
  }

  if (id) {
    updateContact(Number(id), name, phone);
  } else {
    addContact(name, phone);
  }

  contactForm.reset();
  contactIdInput.value = "";
});

// Add contacts
function addContact(name, phone) {
  contacts.push({
    id: Date.now(),
    name,
    phone,
  });
  renderContacts(contacts);
}

// Edit contacts
function editContact(id) {
  const contact = contacts.find(c => c.id === id);

  contactIdInput.value = contact.id;
  nameInput.value = contact.name;
  phoneInput.value = contact.phone;
}
// Update contacts
function updateContact(id, name, phone) {
  contacts = contacts.map((c) => {
    if (c.id === id) {
      return {
        ...c,
        name: name,
        phone: phone,
      };
    } else {
      return c;
    }
  });

  renderContacts(contacts);
}

// Delete contacts
function deleteContact(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this contact?"
  );

  if (!confirmDelete) return;

  contacts = contacts.filter((c) => c.id !== id);
  renderContacts(contacts);
}

// Search Contacts
searchInput.addEventListener("input", function () {
  const query = searchInput.value.toLowerCase();

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(query) ||
    c.phone.includes(query)
  );

  renderContacts(filtered);
});

loadContacts();
