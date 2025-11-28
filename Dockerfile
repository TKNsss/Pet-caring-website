# API-only image; serve the frontend separately from a static host/CDN.

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files first for better layer caching
COPY Pet-caring-website.sln ./
COPY Pet-caring-website/Pet-caring-website.csproj Pet-caring-website/
RUN dotnet restore

# Copy the rest of the source
COPY . .

RUN dotnet publish Pet-caring-website/Pet-caring-website.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Pet-caring-website.dll"]
