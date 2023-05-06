const express = require('express');
const bodyParser = require('body-parser');
const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

// Define the questions and answers
const faq = [
  {
    question: `What do I need to send a PayPal invoice?`,
    answer: `All you need is a PayPal account. Creating and sending invoices is included with your account. If you don’t have one, sign up for an account.`
  },
  {
    question: `Does my customer need to have an account with PayPal?`,
    answer: `No, your customer doesn’t need an account with PayPal. Upon receiving your invoice, your customer will be able to send their payment directly from the invoice.`
  },
  {
    question: `Can my customer pay my invoice in installments?`,
    answer: `Yes. Your customers can pay invoices in a variety of ways: with a debit or credit card, bank account, PayPal balance, or they can even elect to buy now and pay later`
  },
  {
    question: `What happens after I send my invoice?`,
    answer: `We'll send an email to your customer that links to your invoice. They can review the invoice and choose to pay you online with their debit or credit card, or using their PayPal Wallet. You'll get an email confirming that we've sent your invoices, and when you've been paid.`
  }
];

// Load the Universal Sentence Encoder model
const modelPromise = use.load();

// Define a custom embed function to handle single inputs
async function embed(text) {
  const model = await modelPromise;
  const embed = await model.embed(text);
  return embed.arraySync();
}

// Embed all the FAQ questions
const faqEmbeddingsPromise = Promise.all(faq.map(faqItem => embed(faqItem.question)));

// Define a function to calculate the semantic similarity between two embeddings
function calculateSimilarity(embeddings1, embeddings2) {
  console.log(`embedding1: ${embeddings1 instanceof tf.Tensor}`)
  console.log(`embedding2: ${embeddings2 instanceof tf.Tensor}`)
  const similarity = tf.losses.cosineDistance(embeddings1, embeddings2).dataSync()[0];
  return 1 - similarity;
}


// Define an Express.js app
const app = express();
app.use(bodyParser.json());

// Define a route for the chatbot
app.post('/chatbot', async (req, res) => {
  const message = req.body.message;
  if(!message) {
    return res.json({ answer: "I'm sorry, I don't have an answer for that question." });
  }
  // Embed the user's message
  const userEmbeddings = await embed(message);

  // Calculate the similarity between the user's message and all the FAQs
  const faqEmbeddings = await faqEmbeddingsPromise;
  const scores = faqEmbeddings.map(faqEmbeddingsItem => calculateSimilarity(userEmbeddings, faqEmbeddingsItem));

  // Find the index of the FAQ with the highest similarity score
  const maxScoreIndex = scores.indexOf(Math.max(...scores));
  console.log(`${message} : ${scores[maxScoreIndex]}`)
  if (scores[maxScoreIndex] >= 0.85) {
    // Send the best matching answer back to the user
    res.json({ answer: faq[maxScoreIndex].answer });
  } else {
    // Send a default response back to the user
    res.json({ answer: "I'm sorry, I don't have an answer for that question." });
  }
});

// Serve the React app
app.use(express.static('build'));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
