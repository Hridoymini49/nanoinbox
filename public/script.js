document.getElementById("fetchData").addEventListener("click", fetchData);

async function fetchData() {
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!phoneNumber || !startDate || !endDate) {
        alert("Please enter all required fields!");
        return;
    }

    const apiUrl = "https://api.premiumy.net/v1.0/csv";
    const apiKey = "E63cUhu2RESaeXdt_SE-5w"; // আপনার API কী এখানে দিন

    const payload = {
        id: null,
        jsonrpc: "2.0",
        method: "sms.mdr_full:get_listCSV",
        params: {
            filter: {
                start_date: `${startDate}T00:00:00`,
                end_date: `${endDate}T23:59:59`,
                senderid: "NOTICE",
                phone: phoneNumber
            },
            page: 1,
            per_page: 15
        }
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Api-Key": apiKey
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error.message);
            alert(`API Error: ${data.error.message}`);
            return;
        }

        displayData(data.result.mdr_full_list);
    } catch (error) {
        console.error("Error:", error);
        alert(`An error occurred: ${error.message}`);
    }
}

function displayData(dataList) {
    const container = document.getElementById("dataDisplay");
    container.innerHTML = ""; // Clear previous data

    if (!dataList || dataList.length === 0) {
        container.innerHTML = "<p>No data found for the given inputs.</p>";
        return;
    }

    dataList.forEach((item) => {
        const div = document.createElement("div");
        div.className = "data-item";
        div.innerHTML = `
            <p><strong>Phone:</strong> ${item.phone}</p>
            <p><strong>Message:</strong> ${item.message}</p>
            <p><strong>Datetime:</strong> ${item.datetime}</p>
            <p><strong>Sender ID:</strong> ${item.senderid}</p>
            <p><strong>Dialer Rate:</strong> ${item.dialer_rate} ${item.dialer_cur_name}</p>
        `;
        container.appendChild(div);
    });
}
