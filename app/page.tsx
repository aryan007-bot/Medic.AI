"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Upload,
  FileText,
  Activity,
  User,
  LogOut,
  BarChart3,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
} from "lucide-react"

export default function MedicAIDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ id: string; name: string; size: string; type: string; uploadDate: string }>
  >([])
  const [profileData, setProfileData] = useState({
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@medicai.com",
    specialization: "Internal Medicine",
    license: "MD-12345",
    phone: "+1 (555) 123-4567",
  })

  const [formData, setFormData] = useState({
    age: "",
    bloodPressure: "",
    glucoseLevel: "",
    bmi: "",
  })
  const [diseaseData, setDiseaseData] = useState({
    selectedDisease: "",
    customDisease: "",
    symptoms: "",
    duration: "",
  })
  const [prediction, setPrediction] = useState<{
    outcome: string
    confidence: number
    risk: "low" | "medium" | "high"
    recommendations: string[]
    timestamp: string
  } | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const commonDiseases = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Asthma",
    "Arthritis",
    "Depression",
    "Anxiety",
    "Migraine",
    "Obesity",
    "Sleep Apnea",
    "Chronic Kidney Disease",
    "COPD",
    "Other (Custom)",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDiseaseChange = (field: string, value: string) => {
    setDiseaseData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const newFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        type: file.type.includes("image") ? "Image" : file.type.includes("pdf") ? "PDF" : "Document",
        uploadDate: new Date().toLocaleDateString(),
      }
      setUploadedFiles((prev) => [...prev, newFile])
    })
  }

  const handlePrediction = async () => {
    setIsAnalyzing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const disease =
      diseaseData.selectedDisease === "Other (Custom)" ? diseaseData.customDisease : diseaseData.selectedDisease

    const outcomes = [
      {
        outcome: `Low Risk of ${disease || "Health Issues"}`,
        confidence: 92,
        risk: "low" as const,
        recommendations: ["Continue regular check-ups", "Maintain healthy lifestyle", "Monitor symptoms"],
      },
      {
        outcome: `Medium Risk of ${disease || "Health Issues"}`,
        confidence: 67,
        risk: "medium" as const,
        recommendations: ["Schedule follow-up appointment", "Consider lifestyle modifications", "Monitor closely"],
      },
      {
        outcome: `High Risk of ${disease || "Health Issues"}`,
        confidence: 82,
        risk: "high" as const,
        recommendations: [
          "Immediate medical consultation required",
          "Start preventive treatment",
          "Regular monitoring essential",
        ],
      },
    ]

    const randomPrediction = outcomes[Math.floor(Math.random() * outcomes.length)]
    setPrediction({
      ...randomPrediction,
      timestamp: new Date().toLocaleString(),
    })
    setIsAnalyzing(false)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Medic.AI</h1>
          </div>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeSection === "dashboard" ? "default" : "ghost"}
              className={`w-full justify-start gap-2 ${activeSection === "dashboard" ? "bg-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
              onClick={() => setActiveSection("dashboard")}
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeSection === "upload" ? "default" : "ghost"}
              className={`w-full justify-start gap-2 ${activeSection === "upload" ? "bg-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
              onClick={() => setActiveSection("upload")}
            >
              <Upload className="h-4 w-4" />
              Upload Report
            </Button>
            <Button
              variant={activeSection === "predictions" ? "default" : "ghost"}
              className={`w-full justify-start gap-2 ${activeSection === "predictions" ? "bg-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
              onClick={() => setActiveSection("predictions")}
            >
              <Activity className="h-4 w-4" />
              Predictions
            </Button>
            <Button
              variant={activeSection === "profile" ? "default" : "ghost"}
              className={`w-full justify-start gap-2 ${activeSection === "profile" ? "bg-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
              onClick={() => setActiveSection("profile")}
            >
              <User className="h-4 w-4" />
              Profile
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          <div className="max-w-4xl mx-auto">
            {activeSection === "dashboard" && (
              <>
                <h2 className="text-3xl font-bold text-foreground mb-2">Medical Prediction Dashboard</h2>
                <p className="text-muted-foreground mb-8">
                  Upload medical reports and enter patient data for AI-powered health predictions
                </p>

                <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
                  {/* Upload Section */}
                  <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-card-foreground">
                        <Upload className="h-5 w-5" />
                        Upload Medical Report
                      </CardTitle>
                      <CardDescription>Upload X-rays, lab reports, or other medical documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                          isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsDragOver(true)
                        }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault()
                          setIsDragOver(false)
                          handleFileUpload(e.dataTransfer.files)
                        }}
                        onClick={() => {
                          const input = document.createElement("input")
                          input.type = "file"
                          input.multiple = true
                          input.accept = ".pdf,.jpg,.jpeg,.png,.dcm"
                          input.onchange = (e) => handleFileUpload((e.target as HTMLInputElement).files)
                          input.click()
                        }}
                      >
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your files here, or click to browse
                        </p>
                        <Button variant="outline" size="sm">
                          Choose Files
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Patient Data Form */}
                  <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-card-foreground">
                        <User className="h-5 w-5" />
                        Patient Information
                      </CardTitle>
                      <CardDescription>Enter patient vitals and health metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="age" className="text-sm font-medium">
                            Age
                          </Label>
                          <Input
                            id="age"
                            type="number"
                            placeholder="35"
                            value={formData.age}
                            onChange={(e) => handleInputChange("age", e.target.value)}
                            className="bg-input border-border"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bmi" className="text-sm font-medium">
                            BMI
                          </Label>
                          <Input
                            id="bmi"
                            type="number"
                            placeholder="24.5"
                            value={formData.bmi}
                            onChange={(e) => handleInputChange("bmi", e.target.value)}
                            className="bg-input border-border"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bloodPressure" className="text-sm font-medium">
                          Blood Pressure
                        </Label>
                        <Input
                          id="bloodPressure"
                          placeholder="120/80"
                          value={formData.bloodPressure}
                          onChange={(e) => handleInputChange("bloodPressure", e.target.value)}
                          className="bg-input border-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor="glucoseLevel" className="text-sm font-medium">
                          Glucose Level (mg/dL)
                        </Label>
                        <Input
                          id="glucoseLevel"
                          type="number"
                          placeholder="95"
                          value={formData.glucoseLevel}
                          onChange={(e) => handleInputChange("glucoseLevel", e.target.value)}
                          className="bg-input border-border"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Disease Selection Section */}
                  <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-card-foreground">
                        <Stethoscope className="h-5 w-5" />
                        Disease & Symptoms
                      </CardTitle>
                      <CardDescription>Select or specify the condition to analyze</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="disease" className="text-sm font-medium">
                          Select Disease/Condition
                        </Label>
                        <Select
                          value={diseaseData.selectedDisease}
                          onValueChange={(value) => handleDiseaseChange("selectedDisease", value)}
                        >
                          <SelectTrigger className="bg-input border-border">
                            <SelectValue placeholder="Choose a condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {commonDiseases.map((disease) => (
                              <SelectItem key={disease} value={disease}>
                                {disease}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {diseaseData.selectedDisease === "Other (Custom)" && (
                        <div>
                          <Label htmlFor="customDisease" className="text-sm font-medium">
                            Custom Disease/Condition
                          </Label>
                          <Input
                            id="customDisease"
                            placeholder="Enter condition name"
                            value={diseaseData.customDisease}
                            onChange={(e) => handleDiseaseChange("customDisease", e.target.value)}
                            className="bg-input border-border"
                          />
                        </div>
                      )}

                      <div>
                        <Label htmlFor="symptoms" className="text-sm font-medium">
                          Symptoms
                        </Label>
                        <Textarea
                          id="symptoms"
                          placeholder="Describe current symptoms..."
                          value={diseaseData.symptoms}
                          onChange={(e) => handleDiseaseChange("symptoms", e.target.value)}
                          className="bg-input border-border min-h-[80px]"
                        />
                      </div>

                      <div>
                        <Label htmlFor="duration" className="text-sm font-medium">
                          Duration
                        </Label>
                        <Select
                          value={diseaseData.duration}
                          onValueChange={(value) => handleDiseaseChange("duration", value)}
                        >
                          <SelectTrigger className="bg-input border-border">
                            <SelectValue placeholder="How long?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-7 days">1-7 days</SelectItem>
                            <SelectItem value="1-4 weeks">1-4 weeks</SelectItem>
                            <SelectItem value="1-6 months">1-6 months</SelectItem>
                            <SelectItem value="6+ months">6+ months</SelectItem>
                            <SelectItem value="chronic">Chronic condition</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Get Prediction Button */}
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handlePrediction}
                    size="lg"
                    disabled={isAnalyzing}
                    className="px-12 py-3 text-lg font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <Clock className="h-5 w-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Get AI Prediction"
                    )}
                  </Button>
                </div>

                {/* Results Section */}
                {prediction && (
                  <Card className="mt-8 bg-card border-border shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-card-foreground">
                        <Activity className="h-5 w-5" />
                        Prediction Results
                      </CardTitle>
                      <CardDescription>AI-powered health risk assessment based on provided data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 bg-muted/30 rounded-lg">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-foreground">{prediction.outcome}</h3>
                            <div className="flex items-center gap-3">
                              <Badge className={getRiskColor(prediction.risk)}>
                                {prediction.risk.toUpperCase()} RISK
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Confidence: {prediction.confidence}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">Generated: {prediction.timestamp}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-primary">{prediction.confidence}%</div>
                            <div className="text-sm text-muted-foreground">Confidence Score</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {prediction.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {activeSection === "upload" && (
              <>
                <h2 className="text-3xl font-bold text-foreground mb-2">Upload Medical Reports</h2>
                <p className="text-muted-foreground mb-8">Manage and organize your medical documents</p>

                <div className="grid gap-6">
                  <Card className="bg-card border-border shadow-sm">
                    <CardHeader>
                      <CardTitle>Upload New Files</CardTitle>
                      <CardDescription>Drag and drop files or click to browse</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                          isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsDragOver(true)
                        }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault()
                          setIsDragOver(false)
                          handleFileUpload(e.dataTransfer.files)
                        }}
                        onClick={() => {
                          const input = document.createElement("input")
                          input.type = "file"
                          input.multiple = true
                          input.accept = ".pdf,.jpg,.jpeg,.png,.dcm"
                          input.onchange = (e) => handleFileUpload((e.target as HTMLInputElement).files)
                          input.click()
                        }}
                      >
                        <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">Upload Medical Files</h3>
                        <p className="text-muted-foreground mb-4">Supports PDF, JPEG, PNG, and DICOM files</p>
                        <Button variant="outline">Choose Files</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {uploadedFiles.length > 0 && (
                    <Card className="bg-card border-border shadow-sm">
                      <CardHeader>
                        <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
                        <CardDescription>Recently uploaded medical documents</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {uploadedFiles.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="h-8 w-8 text-primary" />
                                <div>
                                  <p className="font-medium">{file.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {file.type} • {file.size} • Uploaded {file.uploadDate}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}

            {activeSection === "predictions" && (
              <>
                <h2 className="text-3xl font-bold text-foreground mb-2">Prediction History</h2>
                <p className="text-muted-foreground mb-8">View and manage your AI prediction results</p>

                {prediction ? (
                  <Card className="bg-card border-border shadow-sm">
                    <CardHeader>
                      <CardTitle>Latest Prediction</CardTitle>
                      <CardDescription>Most recent AI analysis result</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">{prediction.outcome}</h3>
                            <div className="flex items-center gap-3">
                              <Badge className={getRiskColor(prediction.risk)}>
                                {prediction.risk.toUpperCase()} RISK
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Confidence: {prediction.confidence}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">Generated: {prediction.timestamp}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{prediction.confidence}%</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-3">Recommendations</h4>
                          <ul className="space-y-2">
                            {prediction.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-card border-border shadow-sm">
                    <CardContent className="text-center py-12">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No Predictions Yet</h3>
                      <p className="text-muted-foreground mb-4">Run your first AI prediction from the dashboard</p>
                      <Button onClick={() => setActiveSection("dashboard")}>Go to Dashboard</Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {activeSection === "profile" && (
              <>
                <h2 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h2>
                <p className="text-muted-foreground mb-8">Manage your account information and preferences</p>

                <div className="grid gap-6 max-w-2xl">
                  <Card className="bg-card border-border shadow-sm">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your profile details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          value={profileData.specialization}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, specialization: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="license">License Number</Label>
                          <Input
                            id="license"
                            value={profileData.license}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, license: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                      </div>
                      <Button className="w-full">Save Changes</Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border shadow-sm">
                    <CardHeader>
                      <CardTitle>Account Statistics</CardTitle>
                      <CardDescription>Your usage overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{uploadedFiles.length}</div>
                          <div className="text-sm text-muted-foreground">Files Uploaded</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{prediction ? 1 : 0}</div>
                          <div className="text-sm text-muted-foreground">Predictions Made</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold text-primary">98%</div>
                          <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
