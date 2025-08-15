<!-- dashboard.html -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dashboard</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <!-- Navbar or Header -->
  <header>
    <div id="user-info">
      <!-- Profile image, full name, and phone will load here dynamically from app.js -->
      <img src="images/default-profile.png" alt="Profile" style="width:40px;height:40px;border-radius:50%;margin-right:8px;vertical-align:middle;">
      Loading...
    </div>
    <button id="logoutBtn">Logout</button>
  </header>

  <!-- Dashboard content -->
  <main>
    <section id="dashboard-options">
      <!-- Deposit, Withdraw, History, Customer Service buttons go here -->
    </section>

    <!-- History Table -->
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Amount</th>
          <th>Proof</th>
          <th>Bank</th>
          <th>Account/CellMoni</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody id="history-body">
        <!-- Rows loaded dynamically from app.js -->
      </tbody>
    </table>
  </main>

  <script src="app.js"></script>
</body>
</html>
