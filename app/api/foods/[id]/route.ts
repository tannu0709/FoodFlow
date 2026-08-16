import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import Food from "@/models/food";
import { foodSchema } from "@/lib/validations/food";
import { requireAdmin } from "@/lib/auth";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// ==========================================
// UPDATE FOOD
// ==========================================

export async function PUT(request: Request, { params }: RouteParams) {
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
    // 2. Get ID
    // -----------------------------

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid food ID",
        },
        {
          status: 400,
        },
      );
    }

    // -----------------------------
    // 3. Get body
    // -----------------------------

    const body = await request.json();

    // -----------------------------
    // 4. Validate body
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
    // 5. Connect DB
    // -----------------------------

    await connectToDatabase();

    // -----------------------------
    // 6. Update food
    // -----------------------------

    const food = await Food.findByIdAndUpdate(id, result.data, {
      new: true,
      runValidators: true,
    });

    if (!food) {
      return NextResponse.json(
        {
          success: false,
          message: "Food not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Food updated successfully",
      food,
    });
  } catch (error) {
    console.error("Update food error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update food",
      },
      {
        status: 500,
      },
    );
  }
}

// ==========================================
// DELETE FOOD
// ==========================================

export async function DELETE(request: Request, { params }: RouteParams) {
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
    // 2. Get ID
    // -----------------------------

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid food ID",
        },
        {
          status: 400,
        },
      );
    }

    // -----------------------------
    // 3. Connect DB
    // -----------------------------

    await connectToDatabase();

    // -----------------------------
    // 4. Delete food
    // -----------------------------

    const food = await Food.findByIdAndDelete(id);

    if (!food) {
      return NextResponse.json(
        {
          success: false,
          message: "Food not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    console.error("Delete food error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete food",
      },
      {
        status: 500,
      },
    );
  }
}
