document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    
    // Simulate initial load if no real backend
    loadTrades();

    refreshBtn.addEventListener('click', () => {
        loadTrades();
        // Spin animation
        const svg = refreshBtn.querySelector('svg');
        svg.style.transition = 'transform 0.5s';
        svg.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            svg.style.transition = 'none';
            svg.style.transform = 'rotate(0deg)';
        }, 500);
    });
    
    // Auto refresh every 5 seconds
    setInterval(loadTrades, 5000);
});

async function loadTrades() {
    try {
        // In a real scenario, this fetches from the local server or trades.json
        // For local file viewing, we fetch relative to the HTML file
        const response = await fetch('trades.json');
        if (!response.ok) throw new Error('File not found');
        
        const data = await response.json();
        updateDashboard(data.trades);
    } catch (error) {
        console.log('No trades log found yet or running locally without server. Displaying empty state.');
        // Optional: populate with mock data for demonstration purposes if needed
    }
}

function updateDashboard(trades) {
    if (!trades || trades.length === 0) return;

    // Calculate metrics
    const totalTrades = trades.length;
    const wins = trades.filter(t => t.result === 'win').length;
    const winRate = ((wins / totalTrades) * 100).toFixed(1);
    
    const netPnl = trades.reduce((acc, curr) => acc + curr.profit_loss, 0);

    // Update DOM
    document.getElementById('total-trades').textContent = totalTrades;
    document.getElementById('win-rate').textContent = `${winRate}%`;
    
    const pnlEl = document.getElementById('net-pnl');
    pnlEl.textContent = `$${netPnl.toFixed(2)}`;
    pnlEl.style.color = netPnl >= 0 ? 'var(--success)' : 'var(--danger)';

    // Update Table
    const tbody = document.getElementById('trades-body');
    tbody.innerHTML = ''; // Clear existing
    
    // Reverse to show newest first
    const recentTrades = [...trades].reverse().slice(0, 50);

    recentTrades.forEach(trade => {
        const tr = document.createElement('tr');
        
        const dirClass = trade.direction === 'call' ? 'dir-call' : 'dir-put';
        const resClass = trade.result === 'win' ? 'res-win' : 'res-loss';
        const pnlPrefix = trade.profit_loss >= 0 ? '+' : '';
        
        tr.innerHTML = `
            <td>#${trade.id}</td>
            <td>${trade.timestamp.split(' ')[1]}</td>
            <td><strong>${trade.asset}</strong></td>
            <td class="${dirClass}">${trade.direction.toUpperCase()}</td>
            <td class="${resClass}">${trade.result.toUpperCase()}</td>
            <td class="${resClass}">${pnlPrefix}$${trade.profit_loss.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}
