import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PortfolioManager.css';

const API_BASE_URL = 'http://localhost:8000';

function PortfolioManager({ token }) {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHoldingForm, setShowHoldingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: 'My Portfolio',
    description: '',
    symbol: '',
    quantity: '',
    price: '',
    asset_type: 'stock'
  });
  const [loading, setLoading] = useState(false);

  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, [token]);

  useEffect(() => {
    if (selectedPortfolio) {
      fetchPortfolioData(selectedPortfolio);
      const interval = setInterval(() => {
        fetchPortfolioData(selectedPortfolio);
      }, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [selectedPortfolio, token]);

  const fetchPortfolios = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portfolio`, axiosConfig);
      setPortfolios(response.data);
      if (response.data.length > 0 && !selectedPortfolio) {
        setSelectedPortfolio(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    }
  };

  const fetchPortfolioData = async (portfolioId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portfolio/${portfolioId}`, axiosConfig);
      setPortfolioData(response.data);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    }
  };

  const createPortfolio = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/portfolio`, formData, axiosConfig);
      setShowAddForm(false);
      setFormData({ name: 'My Portfolio', description: '' });
      fetchPortfolios();
    } catch (error) {
      console.error('Error creating portfolio:', error);
      alert(error.response?.data?.detail || 'Error creating portfolio');
    } finally {
      setLoading(false);
    }
  };

  const addHolding = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/portfolio/${selectedPortfolio}/holdings`,
        {
          symbol: formData.symbol,
          quantity: parseFloat(formData.quantity),
          price: parseFloat(formData.price),
          asset_type: formData.asset_type
        },
        axiosConfig
      );
      setShowHoldingForm(false);
      setFormData({ symbol: '', quantity: '', price: '', asset_type: 'stock' });
      fetchPortfolioData(selectedPortfolio);
    } catch (error) {
      console.error('Error adding holding:', error);
      alert(error.response?.data?.detail || 'Error adding holding');
    } finally {
      setLoading(false);
    }
  };

  const removeHolding = async (holdingId) => {
    if (!window.confirm('Are you sure you want to remove this holding?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/portfolio/holdings/${holdingId}`, axiosConfig);
      fetchPortfolioData(selectedPortfolio);
    } catch (error) {
      console.error('Error removing holding:', error);
      alert(error.response?.data?.detail || 'Error removing holding');
    }
  };

  const refreshPortfolio = async () => {
    try {
      await axios.post(`${API_BASE_URL}/portfolio/${selectedPortfolio}/refresh`, {}, axiosConfig);
      fetchPortfolioData(selectedPortfolio);
    } catch (error) {
      console.error('Error refreshing portfolio:', error);
    }
  };

  return (
    <div className="portfolio-manager">
      <div className="portfolio-sidebar">
        <h2>My Portfolios</h2>
        <button className="add-portfolio-btn" onClick={() => setShowAddForm(true)}>
          + New Portfolio
        </button>
        <div className="portfolio-list">
          {portfolios.map(portfolio => (
            <div
              key={portfolio.id}
              className={`portfolio-item ${selectedPortfolio === portfolio.id ? 'active' : ''}`}
              onClick={() => setSelectedPortfolio(portfolio.id)}
            >
              <div className="portfolio-name">{portfolio.name}</div>
              <div className="portfolio-date">
                {new Date(portfolio.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="portfolio-content">
        {selectedPortfolio && portfolioData ? (
          <>
            <div className="portfolio-header">
              <h2>Portfolio Overview</h2>
              <div className="portfolio-actions">
                <button onClick={refreshPortfolio} className="refresh-btn">
                  🔄 Refresh Prices
                </button>
                <button onClick={() => setShowHoldingForm(true)} className="add-holding-btn">
                  + Add Holding
                </button>
              </div>
            </div>

            <div className="portfolio-summary-cards">
              <div className="summary-card">
                <div className="summary-label">Total Value</div>
                <div className="summary-value">${portfolioData.totalValue.toLocaleString()}</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Total Cost</div>
                <div className="summary-value">${portfolioData.totalCost.toLocaleString()}</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Gain/Loss</div>
                <div className={`summary-value ${portfolioData.totalGainLoss >= 0 ? 'positive' : 'negative'}`}>
                  ${portfolioData.totalGainLoss.toLocaleString()} ({portfolioData.totalGainLossPercent.toFixed(2)}%)
                </div>
              </div>
            </div>

            <div className="holdings-table">
              <table>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Quantity</th>
                    <th>Avg Price</th>
                    <th>Current Price</th>
                    <th>Value</th>
                    <th>Gain/Loss</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.portfolio.map(holding => (
                    <tr key={holding.id}>
                      <td><strong>{holding.symbol}</strong></td>
                      <td>{holding.quantity}</td>
                      <td>${holding.average_price.toFixed(2)}</td>
                      <td>${holding.current_price.toFixed(2)}</td>
                      <td>${holding.value.toFixed(2)}</td>
                      <td className={holding.gain_loss >= 0 ? 'positive' : 'negative'}>
                        ${holding.gain_loss.toFixed(2)} ({holding.gain_loss_percent.toFixed(2)}%)
                      </td>
                      <td>
                        <button
                          onClick={() => removeHolding(holding.id)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="no-portfolio">
            <p>Select a portfolio or create a new one to get started</p>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Portfolio</h3>
            <form onSubmit={createPortfolio}>
              <input
                type="text"
                placeholder="Portfolio Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="modal-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHoldingForm && (
        <div className="modal-overlay" onClick={() => setShowHoldingForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Holding</h3>
            <form onSubmit={addHolding}>
              <input
                type="text"
                placeholder="Symbol (e.g., AAPL, BTC)"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                required
              />
              <select
                value={formData.asset_type}
                onChange={(e) => setFormData({ ...formData, asset_type: e.target.value })}
              >
                <option value="stock">Stock</option>
                <option value="crypto">Crypto</option>
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                step="0.0001"
                required
              />
              <input
                type="number"
                placeholder="Price per unit"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                step="0.01"
                required
              />
              <div className="modal-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add'}
                </button>
                <button type="button" onClick={() => setShowHoldingForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioManager;
