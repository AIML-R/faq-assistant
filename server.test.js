const axios = require('axios');

describe('POST /chatbot', () => {

  it('returns the correct answer for a matching FAQ question with high similarity score', async () => {
    const response = await axios.post('http://localhost:3000/chatbot', { message: 'What do I need to send a PayPal invoice?' });
    expect(response.data.answer).toBe('All you need is a PayPal account. Creating and sending invoices is included with your account. If you don’t have one, sign up for an account.');
  });

  it('returns a default response for a matching FAQ question with low similarity score', async () => {
    const response = await axios.post('http://localhost:3000/chatbot', { message: 'How can I check my PayPal balance?' });
    expect(response.data.answer).toBe("I'm sorry, I don't have an answer for that question.");
  });

  it('returns a default response for a non-matching message', async () => {
    const response = await axios.post('http://localhost:3000/chatbot', { message: 'Can you recommend a good restaurant in the area?' });
    expect(response.data.answer).toBe("I'm sorry, I don't have an answer for that question.");
  });

  it('returns a default response for an empty message', async () => {
    const response = await axios.post('http://localhost:3000/chatbot', { message: '' });
    expect(response.data.answer).toBe("I'm sorry, I don't have an answer for that question.");
  });

  it('returns the correct answer for a matching FAQ question with special characters and numbers', async () => {
    const response = await axios.post('http://localhost:3000/chatbot', { message: 'How much does it cost to send a PayPal invoice?' });
    expect(response.data.answer).toBe("I'm sorry, I don't have an answer for that question.");
  });

  it('returns the correct answer for a matching FAQ question with all uppercase letters', async () => {
    const response = await axios.post('http://localhost:3000/chatbot', { message: 'CAN I PAY IN INSTALLMENTS?' });
    expect(response.data.answer).toBe('Yes. Your customers can pay invoices in a variety of ways: with a debit or credit card, bank account, PayPal balance, or they can even elect to buy now and pay later');
  });

  it('returns the correct answer for a matching FAQ question with spelling mistakes', async () => {
    const response = await axios.post('http://localhost:3000/chatbot', { message: 'Whta hapens afetr I sedn my invice?' });
    expect(response.data.answer).toBe("We'll send an email to your customer that links to your invoice. They can review the invoice and choose to pay you online with their debit or credit card, or using their PayPal Wallet. You'll get an email confirming that we've sent your invoices, and when you've been paid.");
  });
});
