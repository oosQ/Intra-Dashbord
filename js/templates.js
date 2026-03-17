import { calculateTotalXP } from "./utils.js";

export const DOM = {
  userCard: document.getElementById("user-info-card"),
  xpCard: document.getElementById("xp-card"),
  loadingState: document.getElementById("loading-state"),
  profileContent: document.getElementById("profile-content"),
  profileError: document.getElementById("profile-error"),
};


export function renderXPInfo(transactions) {
  const totalXP = calculateTotalXP(transactions);
  DOM.xpCard.innerHTML = `
    <h2 class="text-xl font-semibold mb-4">XP Stats</h2>
    <div class="space-y-3 text-slate-300">
      <p><span class="text-slate-400">Total XP:</span> ${totalXP}</p>
      <div>
        <h3 class="text-lg font-medium mb-2">XP Transactions:</h3>
        <ul class="space-y-1">
          ${transactions.map(tx => `
            <li class="border p-2 rounded bg-slate-700">
              <p><span class="text-slate-400">Amount:</span> ${tx.amount}</p>
              <p><span class="text-slate-400">Object:</span> ${tx.object.name} (${tx.object.type})</p>
              <p><span class="text-slate-400">Date:</span> ${new Date(tx.createdAt).toLocaleString()}</p>
            </li>
          `).join("")}
        </ul>
      </div>
    </div>
  `; 
}

export function renderUserInfo(user) {
  DOM.userCard.innerHTML = `
    <h2 class="text-xl font-semibold mb-4">User Info</h2>
    <div class="space-y-2 text-slate-300">
      <p>
        <span class="text-slate-400">ID:</span>
        ${user.id}
      </p>
      <p>
        <span class="text-slate-400">Login:</span>
        ${user.login}
      </p>
      <p>
        <span class="text-slate-400">Full Name:</span>
        ${user.firstName} ${user.lastName}
      </p>
      <p>
        <span class="text-slate-400">Email:</span>
        ${user.email}
      </p>

      <p>
        <span class="text-slate-400">Qualification:</span>
        ${user.attrs.qualification || "N/A"}
      </p>

      <p>
        <span class="text-slate-400">Degree:</span>
        ${user.attrs.Degree || "N/A"}
      </p>

      <p>
        <span class="text-slate-400">Job Title:</span>
        ${user.attrs.jobtitle || "N/A"}
      </p>

      <p>
        <span class="text-slate-400">CPR:</span>
        ${user.attrs.CPRnumber || "N/A"}
      </p>

      <p>
        <span class="text-slate-400">Phone:</span>
        +973 ${user.attrs.PhoneNumber || "N/A"}
      </p>

      <p>
        <span class="text-slate-400">Address:</span>
        ${user.attrs.addressStreet || ""} ${user.attrs.addressCity || ""} ${user.attrs.addressCountry || ""}
      </p>

      <p>
        <span class="text-slate-400">Date of Birth:</span>
        ${user.attrs.dateOfBirth ? new Date(user.attrs.dateOfBirth).toLocaleDateString() : "N/A"}
      </p>

    </div>
  `;
}

/* attrs
attrs": {
          "email": "3lialmubarak@gmail.com",
          "other": "",
          "Degree": "Bsc information system",
          "country": "Bahrain",
          "genders": "Male",
          "othereq": "",
          "graddate": "2025",
          "jobtitle": "Student in University of Bahrain",
          "lastName": "Almubarak",
          "CPRnumber": "030204739",
          "firstName": "Ali",
          "qualifica": "Social Media (e.g. Instagram)",
          "employment": "Student",
          "PhoneNumber": "36902815",
          "addressCity": "Jidali",
          "dateOfBirth": "2003-02-16T00:00:00.000Z",
          "medicalInfo": "",
          "emergencyTel": "+973 66377050",
          "placeOfBirth": "Salmania",
          "addressStreet": "House 513",
          "qualification": "High School Certificate",
          "addressCountry": "Bahrain",
          "countryOfBirth": "Bahrain",
          "id-cardUploadId": "4_z6ffba8e5333cbd4e8f720f1c_f1088bf69b6d1ff49_d20230811_m174651_c002_v0001149_t0040_u01691776011252",
          "pro-picUploadId": "4_z6ffba8e5333cbd4e8f720f1c_f1088bf69b6d1fe65_d20230811_m174618_c002_v0001149_t0045_u01691775978458",
          "addressPostalCode": "721",
          "emergencyLastName": "Shaikh Nasser",
          "emergencyFirstName": "Radhi",
          "emergencyAffiliation": "Parent",
          "addressComplementStreet": "2121",
          "general-conditionsAccepted": true
        }

*/ 