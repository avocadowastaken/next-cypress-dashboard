-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "image" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAccount" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "compoundId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "providerType" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accessTokenExpires" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "accessToken" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVerificationRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires" TIMESTAMP(3) NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "org" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectSecrets" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recordKey" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunInstance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimedAt" TIMESTAMP(3),
    "spec" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "result" JSONB,
    "runId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commit" JSONB NOT NULL,
    "platform" JSONB NOT NULL,
    "groupId" TEXT NOT NULL,
    "ciBuildId" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount.compoundId_unique" ON "UserAccount"("compoundId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount.userId_providerId_unique" ON "UserAccount"("userId", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount.userId_providerId_providerAccountId_unique" ON "UserAccount"("userId", "providerId", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSession.accessToken_unique" ON "UserSession"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "UserSession.sessionToken_unique" ON "UserSession"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "UserVerificationRequest.token_unique" ON "UserVerificationRequest"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Project.org_repo_providerId_unique" ON "Project"("org", "repo", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectSecrets.projectId_unique" ON "ProjectSecrets"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "RunInstance.spec_runId_groupId_unique" ON "RunInstance"("spec", "runId", "groupId");

-- CreateIndex
CREATE INDEX "RunInstance.id_claimedAt_index" ON "RunInstance"("id", "claimedAt");

-- CreateIndex
CREATE INDEX "RunInstance.runId_groupId_claimedAt_index" ON "RunInstance"("runId", "groupId", "claimedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Run.groupId_ciBuildId_projectId_unique" ON "Run"("groupId", "ciBuildId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToUser_AB_unique" ON "_ProjectToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToUser_B_index" ON "_ProjectToUser"("B");

-- AddForeignKey
ALTER TABLE "UserAccount" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSecrets" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunInstance" ADD FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
