-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'COACH', 'STAFF', 'ADMIN');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'TEXT', 'LONG_TEXT', 'EMAIL', 'NUMBER', 'DATE', 'TIME', 'PHONE', 'RATING', 'FILE_UPLOAD', 'CHECKBOX');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phoneNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "oldEmail" TEXT,
    "userId" TEXT NOT NULL,
    "jobTitle" TEXT,
    "bio" TEXT,
    "linkedIn" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "password" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "forgotPasswordToken" TEXT,
    "forgotPasswordTokenExpiry" TIMESTAMP(3),
    "verifyToken" TEXT,
    "verifyTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "company" TEXT,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "attendeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "timeSlot" TEXT,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GCPData" (
    "id" TEXT NOT NULL,
    "urlExpiryDate" TIMESTAMP(3) NOT NULL,
    "blobName" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "validityDuration" INTEGER NOT NULL DEFAULT 7,
    "downloadUrl" TEXT NOT NULL,

    CONSTRAINT "GCPData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionExplanation" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "mediaType" "MediaType",

    CONSTRAINT "QuestionExplanation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionValidation" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "rules" JSONB NOT NULL,

    CONSTRAINT "QuestionValidation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionLogic" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "conditions" JSONB NOT NULL,
    "action" JSONB NOT NULL,

    CONSTRAINT "QuestionLogic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "respondentId" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "surveyResponseId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "QuestionAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_eventId_attendeeId_key" ON "Attendance"("eventId", "attendeeId");

-- CreateIndex
CREATE UNIQUE INDEX "GCPData_assetId_key" ON "GCPData"("assetId");

-- CreateIndex
CREATE INDEX "Survey_createdById_idx" ON "Survey"("createdById");

-- CreateIndex
CREATE INDEX "Question_surveyId_idx" ON "Question"("surveyId");

-- CreateIndex
CREATE INDEX "QuestionOption_questionId_idx" ON "QuestionOption"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionExplanation_questionId_key" ON "QuestionExplanation"("questionId");

-- CreateIndex
CREATE INDEX "QuestionExplanation_questionId_idx" ON "QuestionExplanation"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionValidation_questionId_key" ON "QuestionValidation"("questionId");

-- CreateIndex
CREATE INDEX "QuestionValidation_questionId_idx" ON "QuestionValidation"("questionId");

-- CreateIndex
CREATE INDEX "QuestionLogic_questionId_idx" ON "QuestionLogic"("questionId");

-- CreateIndex
CREATE INDEX "SurveyResponse_surveyId_idx" ON "SurveyResponse"("surveyId");

-- CreateIndex
CREATE INDEX "QuestionAnswer_questionId_idx" ON "QuestionAnswer"("questionId");

-- CreateIndex
CREATE INDEX "QuestionAnswer_surveyResponseId_idx" ON "QuestionAnswer"("surveyResponseId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionExplanation" ADD CONSTRAINT "QuestionExplanation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionValidation" ADD CONSTRAINT "QuestionValidation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionLogic" ADD CONSTRAINT "QuestionLogic_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_surveyResponseId_fkey" FOREIGN KEY ("surveyResponseId") REFERENCES "SurveyResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
