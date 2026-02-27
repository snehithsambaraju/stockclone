require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const { HoldingsModel } = require('./model/HoldingsModel');
const { PositionsModel } = require('./model/PositionsModel');
const { OrdersModel } = require('./model/OrdersModel');
const { UserModel } = require("./model/UserModel");
const { StockDataModel } = require('./model/StockDataModel');
const { PredictionModel } = require('./model/PredictionModel');
const axios = require('axios');

const app = express();

// Middleware

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;





// Database connection (Mongoose v9+ uses promises, not callbacks)
if (!url) {
    console.error('❌ MONGO_URL is not set in .env file');
    console.log('💡 Please create a .env file with: MONGO_URL=your_mongodb_connection_string');
} else {
    mongoose.connect(url)
        .then(() => {
            console.log('✅ Database connected successfully');
        })
        .catch((error) => {
            console.error('❌ Database connection error:', error.message);
        });
}

    // app.get('/addHoldings', async (req, res) => {
    //     try {
    //         let tempHoldings = [
    //             {
    //                 name: "BHARTIARTL",
    //                 qty: 2,
    //                 avg: 538.05,
    //                 price: 541.15,
    //                 net: "+0.58%",
    //                 day: "+2.99%",
    //             },
    //             {
    //                 name: "HDFCBANK",
    //                 qty: 2,
    //                 avg: 1383.4,
    //                 price: 1522.35,
    //                 net: "+10.04%",
    //                 day: "+0.11%",
    //             },
    //             {
    //                 name: "HINDUNILVR",
    //                 qty: 1,
    //                 avg: 2335.85,
    //                 price: 2417.4,
    //                 net: "+3.49%",
    //                 day: "+0.21%",
    //             },
    //             {
    //                 name: "INFY",
    //                 qty: 1,
    //                 avg: 1350.5,
    //                 price: 1555.45,
    //                 net: "+15.18%",
    //                 day: "-1.60%",
    //                 isLoss: true,
    //             },
    //             {
    //                 name: "ITC",
    //                 qty: 5,
    //                 avg: 202.0,
    //                 price: 207.9,
    //                 net: "+2.92%",
    //                 day: "+0.80%",
    //             },
    //             {
    //                 name: "KPITTECH",
    //                 qty: 5,
    //                 avg: 250.3,
    //                 price: 266.45,
    //                 net: "+6.45%",
    //                 day: "+3.54%",
    //             },
    //             {
    //                 name: "M&M",
    //                 qty: 2,
    //                 avg: 809.9,
    //                 price: 779.8,
    //                 net: "-3.72%",
    //                 day: "-0.01%",
    //                 isLoss: true,
    //             },
    //             {
    //                 name: "RELIANCE",
    //                 qty: 1,
    //                 avg: 2193.7,
    //                 price: 2112.4,
    //                 net: "-3.71%",
    //                 day: "+1.44%",
    //             },
    //             {
    //                 name: "SBIN",
    //                 qty: 4,
    //                 avg: 324.35,
    //                 price: 430.2,
    //                 net: "+32.63%",
    //                 day: "-0.34%",
    //                 isLoss: true,
    //             },
    //             {
    //                 name: "SGBMAY29",
    //                 qty: 2,
    //                 avg: 4727.0,
    //                 price: 4719.0,
    //                 net: "-0.17%",
    //                 day: "+0.15%",
    //             },
    //             {
    //                 name: "TATAPOWER",
    //                 qty: 5,
    //                 avg: 104.2,
    //                 price: 124.15,
    //                 net: "+19.15%",
    //                 day: "-0.24%",
    //                 isLoss: true,
    //             },
    //             {
    //                 name: "TCS",
    //                 qty: 1,
    //                 avg: 3041.7,
    //                 price: 3194.8,
    //                 net: "+5.03%",
    //                 day: "-0.25%",
    //                 isLoss: true,
    //             },
    //             {
    //                 name: "WIPRO",
    //                 qty: 4,
    //                 avg: 489.3,
    //                 price: 577.75,
    //                 net: "+18.08%",
    //                 day: "+0.32%",
    //             },
    //         ];

    //         // Use Promise.all to wait for all saves to complete
    //         await Promise.all(
    //             tempHoldings.map(async (item) => {
    //                 const newHolding = new HoldingsModel({
    //                     name: item.name,
    //                     qty: item.qty,
    //                     avg: item.avg,
    //                     price: item.price,
    //                     net: item.net,
    //                     day: item.day,
    //                 });
    //                 return newHolding.save();
    //             })
    //         );

    //         res.send("done!");
    //     } catch (error) {
    //         console.error('Error adding holdings:', error);
    //         res.status(500).send(`Error: ${error.message}`);
    //     }
    // });
// Seed positions
app.get("/addPositions", async (req, res) => {
  try {
    const tempPositions = [
      {
        product: "CNC",
        name: "EVEREADY",
        qty: 2,
        avg: 316.27,
        price: 312.35,
        net: "+0.58%",
        day: "-1.24%",
        isLoss: true,
      },
      {
        product: "CNC",
        name: "JUBLFOOD",
        qty: 1,
        avg: 3124.75,
        price: 3082.65,
        net: "+10.04%",
        day: "-1.35%",
        isLoss: true,
      },
    ];

    await Promise.all(
      tempPositions.map((item) => {
        const newPosition = new PositionsModel({
          product: item.product,
          name: item.name,
          qty: item.qty,
          avg: item.avg,
          price: item.price,
          net: item.net,
          day: item.day,
          isLoss: item.isLoss,
        });

        return newPosition.save();
      })
    );

    res.send("Done!");
  } catch (error) {
    console.error("Error adding positions:", error);
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.get("/allHoldings", async (req, res) => {
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  });
  
  app.get("/allPositions", async (req, res) => {
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
  });
  
  app.post("/newOrder", async (req, res) => {
    let newOrder = new OrdersModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
    });
  
    await newOrder.save();
  
    res.send("Order saved!");
  });

// ---------- AUTH ROUTES ----------

// Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new UserModel({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // For simplicity we're not using JWTs/sessions here.
    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout (stateless example – handled on client)
app.post("/api/auth/logout", (req, res) => {
  // If you add sessions/JWTs later, clear them here.
  res.json({ message: "Logged out" });
});

// ---------- ML PREDICTION ROUTES ----------

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5000";

const extractAxiosError = (error) => {
  if (error && error.response) {
    return {
      status: error.response.status || 500,
      payload: error.response.data || { error: "ML service request failed" }
    };
  }
  if (error && error.code === "ECONNREFUSED") {
    return {
      status: 503,
      payload: {
        error: "ML service is not available. Please ensure it's running on port 5000."
      }
    };
  }
  return {
    status: 500,
    payload: { error: error.message || "Internal server error" }
  };
};

// Get stock price prediction
app.post("/api/predictions/predict", async (req, res) => {
  try {
    const { symbol, days_ahead = 1 } = req.body;

    if (!symbol) {
      return res.status(400).json({ error: "Symbol is required" });
    }

    // Call ML service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/api/v1/predict`, {
      symbol: symbol.toUpperCase(),
      days_ahead
    });

    if (mlResponse.data.success) {
      const prediction = mlResponse.data.data;

      // Best-effort persistence: don't fail prediction if Mongo is unavailable.
      try {
        const predictionDoc = new PredictionModel({
          symbol: prediction.symbol,
          current_price: prediction.current_price,
          predicted_price: prediction.predicted_price,
          predicted_change: prediction.predicted_change,
          confidence: prediction.confidence,
          prediction_date: new Date(prediction.prediction_date),
          prediction_for_date: new Date(Date.now() + days_ahead * 24 * 60 * 60 * 1000),
          model_version: "1.0.0"
        });

        await predictionDoc.save();
      } catch (dbError) {
        console.warn("Prediction generated but failed to save to MongoDB:", dbError.message);
      }

      return res.json({
        success: true,
        data: prediction
      });
    } else {
      return res.status(500).json({
        error: mlResponse.data.error || "Prediction failed"
      });
    }
  } catch (error) {
    console.error("Prediction error:", error.message);
    const parsed = extractAxiosError(error);
    return res.status(parsed.status).json(parsed.payload);
  }
});

// Get latest prediction for a symbol
app.get("/api/predictions/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    const latestPrediction = await PredictionModel.findOne({
      symbol: symbol.toUpperCase()
    }).sort({ prediction_date: -1 });

    if (!latestPrediction) {
      return res.status(404).json({
        error: "No prediction found for this symbol"
      });
    }

    return res.json({
      success: true,
      data: latestPrediction
    });
  } catch (error) {
    console.error("Error fetching prediction:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
});

// Batch prediction for multiple symbols
app.post("/api/predictions/batch", async (req, res) => {
  try {
    const { symbols } = req.body;

    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ error: "Symbols array is required" });
    }

    // Call ML service batch endpoint
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/api/v1/batch-predict`, {
      symbols: symbols.map(s => s.toUpperCase()),
      days_ahead: 1
    });

    if (mlResponse.data.success) {
      // Save predictions to MongoDB
      const predictions = mlResponse.data.data.map(pred => ({
        symbol: pred.symbol,
        current_price: pred.current_price,
        predicted_price: pred.predicted_price,
        predicted_change: pred.predicted_change,
        confidence: pred.confidence,
        prediction_date: new Date(pred.prediction_date),
        prediction_for_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        model_version: "1.0.0"
      }));

      await PredictionModel.insertMany(predictions);

      return res.json({
        success: true,
        data: mlResponse.data.data,
        errors: mlResponse.data.errors
      });
    } else {
      return res.status(500).json({
        error: mlResponse.data.error || "Batch prediction failed"
      });
    }
  } catch (error) {
    console.error("Batch prediction error:", error.message);
    const parsed = extractAxiosError(error);
    return res.status(parsed.status).json(parsed.payload);
  }
});

// Get technical indicators
app.post("/api/predictions/indicators", async (req, res) => {
  try {
    const { symbol, period = "3mo" } = req.body;

    if (!symbol) {
      return res.status(400).json({ error: "Symbol is required" });
    }

    const mlResponse = await axios.post(`${ML_SERVICE_URL}/api/v1/technical-indicators`, {
      symbol: symbol.toUpperCase(),
      period
    });

    if (mlResponse.data.success) {
      return res.json({
        success: true,
        data: mlResponse.data.data
      });
    } else {
      return res.status(500).json({
        error: mlResponse.data.error || "Failed to fetch indicators"
      });
    }
  } catch (error) {
    console.error("Indicators error:", error.message);
    const parsed = extractAxiosError(error);
    return res.status(parsed.status).json(parsed.payload);
  }
});

// Train model for a symbol (admin endpoint)
app.post("/api/predictions/train", async (req, res) => {
  try {
    const { symbol, period = "2y", retrain = false } = req.body;

    if (!symbol) {
      return res.status(400).json({ error: "Symbol is required" });
    }

    // Call ML service training endpoint
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/api/v1/train`, {
      symbol: symbol.toUpperCase(),
      period,
      retrain
    });

    if (mlResponse.data.success) {
      return res.json({
        success: true,
        message: mlResponse.data.message,
        data: mlResponse.data.data
      });
    } else {
      return res.status(500).json({
        error: mlResponse.data.error || "Training failed"
      });
    }
  } catch (error) {
    console.error("Training error:", error.message);
    const parsed = extractAxiosError(error);
    return res.status(parsed.status).json(parsed.payload);
  }
});

// Get prediction history for a symbol
app.get("/api/predictions/:symbol/history", async (req, res) => {
  try {
    const { symbol } = req.params;
    const limit = parseInt(req.query.limit) || 30;

    const predictions = await PredictionModel.find({
      symbol: symbol.toUpperCase()
    })
      .sort({ prediction_date: -1 })
      .limit(limit);

    return res.json({
      success: true,
      data: predictions
    });
  } catch (error) {
    console.error("Error fetching prediction history:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 ML Service URL: ${ML_SERVICE_URL}`);
});
