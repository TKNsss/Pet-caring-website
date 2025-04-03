using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Pet_caring_website.Migrations
{
    /// <inheritdoc />
    public partial class AdjustRoleDatatype : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:AppointmentStatus", "pending,confirmed,completed,canceled")
                .Annotation("Npgsql:Enum:Gender", "male,female")
                .Annotation("Npgsql:Enum:Role", "client,vet,admin");

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    service_id = table.Column<short>(type: "smallint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    service_name = table.Column<string>(type: "character varying(225)", maxLength: 225, nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    create_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Services_pkey", x => x.service_id);
                });

            migrationBuilder.CreateTable(
                name: "Species",
                columns: table => new
                {
                    spc_id = table.Column<short>(type: "smallint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    spc_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Species_pkey", x => x.spc_id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_name = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    email = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    first_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    last_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    password = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    phone = table.Column<string>(type: "character(10)", fixedLength: true, maxLength: 10, nullable: true),
                    address = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    speciality = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    role = table.Column<string>(type: "Role", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Users_pkey", x => x.user_id);
                });

            migrationBuilder.CreateTable(
                name: "Service_Detail",
                columns: table => new
                {
                    svd_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    service_id = table.Column<short>(type: "smallint", nullable: false),
                    amount = table.Column<short>(type: "smallint", nullable: false),
                    duration = table.Column<short>(type: "smallint", nullable: true),
                    price_per_service = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Service_Detail_pkey", x => x.svd_id);
                    table.ForeignKey(
                        name: "fk_service_detail_services",
                        column: x => x.service_id,
                        principalTable: "Services",
                        principalColumn: "service_id");
                });

            migrationBuilder.CreateTable(
                name: "Service_Pricing",
                columns: table => new
                {
                    pricing_id = table.Column<short>(type: "smallint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    service_id = table.Column<short>(type: "smallint", nullable: false),
                    min_weight = table.Column<decimal>(type: "numeric(3,2)", precision: 3, scale: 2, nullable: false),
                    max_weight = table.Column<decimal>(type: "numeric(3,2)", precision: 3, scale: 2, nullable: false),
                    price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    create_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    update_at = table.Column<List<DateTime>>(type: "timestamp with time zone[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Service_Pricing_pkey", x => x.pricing_id);
                    table.ForeignKey(
                        name: "fk_service_pricing_services",
                        column: x => x.service_id,
                        principalTable: "Services",
                        principalColumn: "service_id");
                });

            migrationBuilder.CreateTable(
                name: "Pets",
                columns: table => new
                {
                    pet_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    spc_id = table.Column<short>(type: "smallint", nullable: true),
                    pet_name = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    breed = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    age = table.Column<short>(type: "smallint", nullable: false),
                    gender = table.Column<int>(type: "integer", nullable: false),
                    weight = table.Column<decimal>(type: "numeric(10,1)", precision: 10, scale: 1, nullable: false),
                    notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Pets_pkey", x => x.pet_id);
                    table.ForeignKey(
                        name: "fk_pets_species",
                        column: x => x.spc_id,
                        principalTable: "Species",
                        principalColumn: "spc_id");
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    ap_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    ap_date = table.Column<DateOnly>(type: "date", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: true),
                    create_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Appointments_pkey", x => x.ap_id);
                    table.ForeignKey(
                        name: "fk_appointments_users",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "Pet_Owners",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    pet_id = table.Column<int>(type: "integer", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Pet_Owners_pkey", x => x.id);
                    table.ForeignKey(
                        name: "fk_owners_pets",
                        column: x => x.pet_id,
                        principalTable: "Pets",
                        principalColumn: "pet_id");
                    table.ForeignKey(
                        name: "fk_owners_users",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "Appointment_Details",
                columns: table => new
                {
                    detail_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    ap_id = table.Column<int>(type: "integer", nullable: false),
                    pet_id = table.Column<int>(type: "integer", nullable: false),
                    svd_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Appointment_Details_pkey", x => x.detail_id);
                    table.ForeignKey(
                        name: "fk_appoinment_Details_service_details",
                        column: x => x.svd_id,
                        principalTable: "Service_Detail",
                        principalColumn: "svd_id");
                    table.ForeignKey(
                        name: "fk_appointment_Details_appointments",
                        column: x => x.ap_id,
                        principalTable: "Appointments",
                        principalColumn: "ap_id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_Details_ap_id",
                table: "Appointment_Details",
                column: "ap_id");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_Details_svd_id",
                table: "Appointment_Details",
                column: "svd_id");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_user_id",
                table: "Appointments",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Pet_Owners_pet_id",
                table: "Pet_Owners",
                column: "pet_id");

            migrationBuilder.CreateIndex(
                name: "IX_Pet_Owners_user_id",
                table: "Pet_Owners",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Pets_spc_id",
                table: "Pets",
                column: "spc_id");

            migrationBuilder.CreateIndex(
                name: "IX_Service_Detail_service_id",
                table: "Service_Detail",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "IX_Service_Pricing_service_id",
                table: "Service_Pricing",
                column: "service_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Appointment_Details");

            migrationBuilder.DropTable(
                name: "Pet_Owners");

            migrationBuilder.DropTable(
                name: "Service_Pricing");

            migrationBuilder.DropTable(
                name: "Service_Detail");

            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "Pets");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Species");
        }
    }
}
