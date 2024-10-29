fetch('http://localhost:3001/api/users')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Check if data is logged
        const tableBody = document.querySelector('#userTable tbody');
        if (!tableBody) {
            console.error("Table body element not found!");
            return;
        }
        data.forEach(event => {
            console.log(event); // Log each event to confirm structure

            const title = event.title || 'N/A';
            const description = event.description || 'N/A';
            const location = event.location || 'N/A';
            const time = event.time || 'N/A';
            const club = event.club || 'N/A';
            const date = event.date && event.date.$date ? new Date(event.date.$date).toLocaleDateString() : 'N/A';
            const image = event.image ? `<img src="${event.image}" alt="Event Image" width="50" />` : 'No Image';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${title}</td>
                <td>${description}</td>
                <td>${location}</td>
                <td>${time}</td>
                <td>${club}</td>
                <td>${date}</td>
                <td>${image}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching event data:', error));
