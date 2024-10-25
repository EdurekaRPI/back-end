fetch('http://localhost:3001/api/users') // Replace with the actual endpoint
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log to see the structure
        const tableBody = document.querySelector('#userTable tbody');
        data.forEach(event => {
            console.log(event); // Log each event to verify properties
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.title}</td>
                <td>${event.description}</td>
                <td>${event.location}</td>
                <td>${event.time}</td>
                <td>${event.club}</td>
                <td>${new Date(event.date.$date).toLocaleDateString()}</td>
                <td><img src="${event.image}" alt="Event Image" width="50" /></td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching event data:', error));
