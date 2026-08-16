import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Food from "@/models/food";
import { getCurrentUser } from "@/lib/auth";

interface CartItem {
  _id: string;
  quantity: number | string;
}

interface FoodDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
}

export async function POST(request: Request) {
  try {
    // ----------------------------------------
    // 1. Get logged-in user from JWT
    // ----------------------------------------

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 },
      );
    }

    // ----------------------------------------
    // 2. Get request body
    // ----------------------------------------

    const body = await request.json();

    const { items, deliveryAddress } = body as {
      items: CartItem[];
      deliveryAddress: string;
    };

    // ----------------------------------------
    // 3. Validate cart
    // ----------------------------------------

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty",
        },
        { status: 400 },
      );
    }

    // ----------------------------------------
    // 4. Validate delivery address
    // ----------------------------------------

    if (!deliveryAddress?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Delivery address is required",
        },
        { status: 400 },
      );
    }

    // ----------------------------------------
    // 5. Connect to MongoDB
    // ----------------------------------------

    await connectToDatabase();

    // ----------------------------------------
    // 6. Get food IDs from cart
    // ----------------------------------------

    const foodIds = items.map((item: CartItem) => item._id);

    // ----------------------------------------
    // 7. Get actual food data from database
    // ----------------------------------------
    // IMPORTANT:
    // We DON'T trust price from frontend.
    // We get the real price from MongoDB.

    const foods = (await Food.find({
      _id: { $in: foodIds },
    })) as unknown as FoodDoc[];

    // ----------------------------------------
    // 8. Create order items
    // ----------------------------------------

    const orderItems = items.map((item: CartItem) => {
      const food = foods.find((f: FoodDoc) => f._id.toString() === item._id);

      if (!food) {
        throw new Error(`Food not found: ${item._id}`);
      }

      const quantity = Number(item.quantity);

      // Validate quantity
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Invalid quantity");
      }

      return {
        foodId: food._id,
        name: food.name,
        price: food.price,
        quantity,
      };
    });

    // ----------------------------------------
    // 9. Calculate total amount
    // ----------------------------------------

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // ----------------------------------------
    // 10. Create order
    // ----------------------------------------
    // IMPORTANT:
    // userId comes from JWT,
    // NOT from frontend.

    const order = await Order.create({
      userId: user.userId,
      items: orderItems,
      totalAmount,
      deliveryAddress: deliveryAddress.trim(),
    });

    // ----------------------------------------
    // 11. Return success response
    // ----------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to place order",
      },
      { status: 500 },
    );
  }
}

// ======================================================
// GET MY ORDERS
// ======================================================

export async function GET() {
  try {
    // ----------------------------------------
    // 1. Get logged-in user from JWT
    // ----------------------------------------

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 },
      );
    }

    // ----------------------------------------
    // 2. Connect to MongoDB
    // ----------------------------------------

    await connectToDatabase();

    // ----------------------------------------
    // 3. Find only this user's orders
    // ----------------------------------------

    const orders = await Order.find({
      userId: user.userId,
    }).sort({
      createdAt: -1,
    });

    // ----------------------------------------
    // 4. Return orders
    // ----------------------------------------

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
      },
      { status: 500 },
    );
  }
}
