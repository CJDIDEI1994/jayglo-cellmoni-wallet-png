<!-- dashboard.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dashboard</title>
  <link rel="stylesheet" href="styles.css">
  <style>
    /* ---------- Basic 2025 style ---------- */
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      background-color: #ff0000;
      color: #fff;
    }

    #user-info img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 8px;
      vertical-align: middle;
    }

    #logoutBtn {
      background-color: #fff;
      color: #ff0000;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }

    main {
      padding: 20px;
    }

    #dashboard-options {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }

    .dashboard-btn {
      background-color: #ff0000;
      color: #fff;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s ease;
      position: relative;
    }

    .dashboard-btn:active {
      background-color: #b20000;
    }

    .dashboard-btn .loading {
      display: none;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
    }

    table th, table td {
      padding: 12px;
      border-bottom: 1px solid #ddd;
      text-align: left;
    }

    table th {
      background-color: #ff0000;
      color: #fff;
    }

    .pending {
      color: orange;
    }

    .approved {
      color: green;
    }

    .rejected {
      color: red;
    }
  </style>
</head>
<body>

  <!-- Navbar -->
  <header>
    <div id="user-info">
      <img src="images/default-profile.png" alt="Profile"> Loading...
    </div>
    <button id="logoutBtn">Logout</button>
  </header>

  <!-- Dashboard main content -->
  <main>
    <section id="dashboard-options">
      <button class="dashboard-btn" id="depositBtn">
        Deposit <span class="loading">⏳</span>
      </button>
      <button class="dashboard-btn" id="withdrawBtn">
        Withdraw <span class="loading">⏳</span>
      </button>
      <button class="dashboard-btn" id="historyBtn">
        History <span class="loading">⏳</span>
      </button>
      <button class="dashboard-btn" id="customerServiceBtn">
        Customer Service <span class="loading">⏳</span>
      </button>
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
