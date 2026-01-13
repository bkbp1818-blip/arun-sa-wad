import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupDuplicates() {
  console.log("🔍 Checking for duplicate products...\n");

  // Get all products
  const allProducts = await prisma.product.findMany({
    orderBy: { createdAt: "asc" }, // Keep oldest
  });

  console.log(`Total products: ${allProducts.length}`);

  // Group by name
  const productsByName = new Map<string, typeof allProducts>();

  for (const product of allProducts) {
    const existing = productsByName.get(product.name) || [];
    existing.push(product);
    productsByName.set(product.name, existing);
  }

  // Find duplicates
  const duplicatesToDelete: string[] = [];

  for (const [name, products] of productsByName) {
    if (products.length > 1) {
      console.log(`\n📦 "${name}" - ${products.length} copies found`);
      // Keep the first one (oldest), delete the rest
      const [keep, ...toDelete] = products;
      console.log(`   ✅ Keep: ${keep.id} (created: ${keep.createdAt.toISOString()})`);
      for (const dup of toDelete) {
        console.log(`   ❌ Delete: ${dup.id} (created: ${dup.createdAt.toISOString()})`);
        duplicatesToDelete.push(dup.id);
      }
    }
  }

  if (duplicatesToDelete.length === 0) {
    console.log("\n✨ No duplicates found!");
    return;
  }

  console.log(`\n🗑️  Deleting ${duplicatesToDelete.length} duplicate products...`);

  // Check if any duplicates are referenced in BookingItems
  const referencedProducts = await prisma.bookingItem.findMany({
    where: { productId: { in: duplicatesToDelete } },
    select: { productId: true },
  });

  if (referencedProducts.length > 0) {
    console.log(`\n⚠️  Warning: ${referencedProducts.length} duplicates are referenced in bookings.`);
    console.log("   These will be skipped to maintain data integrity.");

    const referencedIds = new Set(referencedProducts.map(r => r.productId));
    const safeToDelete = duplicatesToDelete.filter(id => !referencedIds.has(id));

    if (safeToDelete.length > 0) {
      const result = await prisma.product.deleteMany({
        where: { id: { in: safeToDelete } },
      });
      console.log(`\n✅ Deleted ${result.count} duplicate products (skipped ${referencedIds.size} referenced)`);
    } else {
      console.log("\n❌ No safe duplicates to delete.");
    }
  } else {
    // Safe to delete all duplicates
    const result = await prisma.product.deleteMany({
      where: { id: { in: duplicatesToDelete } },
    });
    console.log(`\n✅ Deleted ${result.count} duplicate products!`);
  }

  // Show final count
  const finalCount = await prisma.product.count();
  console.log(`\n📊 Final product count: ${finalCount}`);
}

cleanupDuplicates()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
