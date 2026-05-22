-- Run this against production with autocommit enabled.
-- It only adds nullable columns and indexes. It does not drop or rewrite data.

ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS "ceo_signature_url" character varying,
  ADD COLUMN IF NOT EXISTS "tutor_signature_url" character varying;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_user_role" ON "user" ("role");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_user_phone_no" ON "user" ("phone_no");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_user_referral_count" ON "user" ("referral_count");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_user_referred_by_id" ON "user" ("referred_by_id");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_course_title" ON "course" ("title");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_course_is_paid" ON "course" ("is_paid");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_course_price" ON "course" ("price");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_course_is_approved" ON "course" ("is_approved");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_course_tutor_id" ON "course" ("tutor_id");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_material_course_id" ON "material" ("course_id");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_material_tutor_id" ON "material" ("tutor_id");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_material_amount" ON "material" ("amount");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_book_is_paid" ON "book" ("is_paid");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_book_amount" ON "book" ("amount");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_paper_title" ON "paper" ("title");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_paper_tutor_id" ON "paper" ("tutor_id");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_paper_is_paid" ON "paper" ("is_paid");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_paper_amount" ON "paper" ("amount");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_enrollment_student_id" ON "enrollment" ("student_id");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_enrollment_course_id" ON "enrollment" ("course_id");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_enrollment_enrolled_at" ON "enrollment" ("enrolled_at");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_enrollment_completed_at" ON "enrollment" ("completed_at");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_material_purchase_student_id" ON "material_purchase" ("student_id");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_material_purchase_material_id" ON "material_purchase" ("material_id");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_material_purchase_enrolled_at" ON "material_purchase" ("enrolled_at");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_material_purchase_completed_at" ON "material_purchase" ("completed_at");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_book_purchase_student_id" ON "book_purchase" ("student_id");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_book_purchase_book_id" ON "book_purchase" ("book_id");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_book_purchase_purchased_at" ON "book_purchase" ("purchased_at");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_paper_purchase_student_id" ON "paper_purchase" ("student_id");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_paper_purchase_paper_id" ON "paper_purchase" ("paper_id");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_paper_purchase_purchased_at" ON "paper_purchase" ("purchased_at");
