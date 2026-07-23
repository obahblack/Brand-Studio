CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_kit_id" uuid NOT NULL,
	"asset_type" text NOT NULL,
	"asset_name" text NOT NULL,
	"file_url" text,
	"file_type" text,
	"metadata" jsonb,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brand_kits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"brand_name" text NOT NULL,
	"website_url" text,
	"brand_description" text,
	"logo_url" text,
	"brand_analysis" jsonb,
	"design_system" jsonb,
	"color_palette" jsonb,
	"typography" jsonb,
	"design_tokens" jsonb,
	"status" text DEFAULT 'pending',
	"error_message" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_brand_kit_id_brand_kits_id_fk" FOREIGN KEY ("brand_kit_id") REFERENCES "public"."brand_kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD CONSTRAINT "brand_kits_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;