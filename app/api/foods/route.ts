import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import Food from "@/models/food";
import { foodSchema } from "@/lib/validations/food";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();

    const foods = await Food.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      foods,
    });
  } catch (error) {
    console.error("Get foods error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch foods",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    // -----------------------------
    // 1. Admin authorization
    // -----------------------------

    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        {
          status: auth.status,
        },
      );
    }

    // -----------------------------
    // 2. Read request body
    // -----------------------------

    const body = await request.json();

    // -----------------------------
    // 3. Validate input
    // -----------------------------

    const result = foodSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    // -----------------------------
    // 4. Connect database
    // -----------------------------

    await connectToDatabase();

    // -----------------------------
    // 5. Create food
    // -----------------------------

    const food = await Food.create(result.data);

    // -----------------------------
    // 6. Return response
    // -----------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Food created successfully",
        food,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Create food error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create food",
      },
      {
        status: 500,
      },
    );
  }
}
