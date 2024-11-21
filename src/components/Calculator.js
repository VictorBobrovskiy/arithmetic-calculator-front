import React, { useState, useEffect } from 'react';
import { Alert, Button, Form, Card } from 'react-bootstrap';
import { api } from './api';

const Calculator = () => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [operation, setOperation] = useState('addition');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);

  const operations = [
    { type: 'addition', label: 'Addition (+)', cost: 2 },
    { type: 'subtraction', label: 'Subtraction (-)', cost: 2 },
    { type: 'multiplication', label: 'Multiplication (×)', cost: 3 },
    { type: 'division', label: 'Division (÷)', cost: 3 },
    { type: 'square_root', label: 'Square Root (√)', cost: 4 },
    { type: 'random_string', label: 'Random String', cost: 5 }
  ];

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      const response = await api.get('/api/v1/balance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      setError('Failed to fetch balance');
    }
  };

  const handleCalculate = async () => {
    setError(null);
    setResult(null);
    
    try {
      const response = await api.post('http://localhost:8081/api/v1/operations', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
          operation,
          input1: Number(input1),
          input2: operation !== 'square_root' ? Number(input2) : undefined
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }

      setResult(data.result);
      setBalance(data.newBalance);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <Card.Header>
        <Card.Title className="d-flex justify-content-between align-items-center">
          Calculator
          <span className="text-sm">Balance: ${balance.toFixed(2)}</span>
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="space-y-4">
          <Form.Group>
            <Form.Label>Select Operation</Form.Label>
            <Form.Control
              as="select"
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
            >
              {operations.map(op => (
                <option key={op.type} value={op.type}>
                  {op.label} (Cost: ${op.cost})
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Control
              type="number"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              placeholder="First number"
            />
            
            {operation !== 'square_root' && operation !== 'random_string' && (
              <Form.Control
                type="number"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                placeholder="Second number"
              />
            )}
          </Form.Group>

          <Button 
            onClick={handleCalculate}
            className="w-full"
          >
            Calculate
          </Button>

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          {result !== null && (
            <Alert variant="success">
              Result: {result}
            </Alert>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Calculator;