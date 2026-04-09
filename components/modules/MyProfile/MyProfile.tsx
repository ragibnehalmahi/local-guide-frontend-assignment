// components/modules/MyProfile/MyProfile.tsx (Updated)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Save, User, Mail, Phone, MapPin, Globe, Star, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { updateMyProfile } from "@/services/auth/auth.service";
import { toast } from "sonner";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: "tourist" | "guide" | "admin";
  profilePicture?: string;
  bio?: string;
  languages?: string[];
  phone?: string;
  address?: string;
  expertise?: string[]; // For guide
  dailyRate?: number; // For guide
  travelPreferences?: string[]; // For tourist
}

interface MyProfileProps {
  userInfo: UserInfo;
}

// Define proper type for form data
interface FormData {
  name: string;
  bio: string;
  phone: string;
  address: string;
  languages: string;
  expertise: string;
  dailyRate: string;
  travelPreferences: string;
}

// Define type for the data we send to backend
interface UserUpdateData {
  name: string;
  bio: string;
  phone: string;
  address: string;
  languages: string[];
  expertise?: string[];
  dailyRate?: number;
  travelPreferences?: string[];
}

 const getRoleColor = (role: string) => {
    switch (role) {
      case "guide":
        return "bg-blue-100 text-blue-800";
      case "tourist":
        return "bg-green-100 text-green-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // রোলের টেক্সট ফরম্যাট করা
  const getRoleText = (role: string) => {
    switch (role) {
      case "guide":
        return "Local Guide";
      case "tourist":
        return "Tourist";
      case "admin":
        return "Admin";
      default:
        return role;
    }
  };

  // ইউজারের নামের প্রথম অক্ষর দিয়ে অবতার তৈরি (যখন ছবি থাকবে না)
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

 

// ... (UserInfo and other interfaces remain same as you provided)

export default function MyProfile({ userInfo }: MyProfileProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    userInfo.profilePicture || null
  );

  const [form, setForm] = useState<FormData>({
    name: userInfo.name || "",
    bio: userInfo.bio || "",
    phone: userInfo.phone || "",
    address: userInfo.address || "", // এটি ইন্টারফেসে location হিসেবে থাকতে পারে
    languages: userInfo.languages?.join(", ") || "",
    expertise: userInfo.expertise?.join(", ") || "",
    dailyRate: userInfo.dailyRate?.toString() || "0",
    travelPreferences: userInfo.travelPreferences?.join(", ") || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name as keyof FormData]: value });
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const userData: any = {
  //       name: form.name,
  //       bio: form.bio,
  //       phone: form.phone,
  //       address: form.address,
  //       languages: form.languages.split(",").map(lang => lang.trim()).filter(Boolean),
  //     };

  //     if (userInfo.role === "guide") {
  //       userData.expertise = form.expertise.split(",").map(exp => exp.trim()).filter(Boolean);
  //       userData.dailyRate = parseFloat(form.dailyRate) || 0;
  //     }

  //     const formData = new FormData();
  //     formData.append("data", JSON.stringify(userData));
      
  //     if (profilePic) {
  //       formData.append("profilePicture", profilePic); 
  //     }

  //     // ✅ Use updated service (handles cookies & correct endpoint)
  //     const result = await updateMyProfile(formData);

  //     if (result.success) {
  //       toast.success("Profile updated successfully");
        
  //       // Update localStorage user info if needed
  //       if (typeof window !== "undefined") {
  //         const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  //         localStorage.setItem("user", JSON.stringify({ ...storedUser, ...result.data }));
  //       }
        
  //       router.refresh();
  //     } else {
  //       throw new Error(result.message || "Failed to update profile");
  //     }
  //   } catch (error: any) {
  //     console.error("Update Error:", error);
  //     toast.error(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const userData: any = {
      name: form.name,
      bio: form.bio,
      phone: form.phone,
      address: form.address,
      languages: form.languages.split(",").map(lang => lang.trim()).filter(Boolean),
    };

    // গাইডের জন্য এক্সট্রা ডাটা
    if (userInfo.role === "guide") {
      userData.expertise = form.expertise.split(",").map(exp => exp.trim()).filter(Boolean);
      userData.dailyRate = parseFloat(form.dailyRate) || 0;
    }

    // ⚡ ট্যুরিস্টদের জন্য এক্সট্রা ডাটা (এটি মিসিং ছিল)
    if (userInfo.role === "tourist") {
      userData.travelPreferences = form.travelPreferences.split(",").map(pref => pref.trim()).filter(Boolean);
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify(userData));
    
    if (profilePic) {
      formData.append("profilePicture", profilePic); 
    }

    const result = await updateMyProfile(formData);
        if (result.success) {
        toast.success("Profile updated successfully");
        
        // Update localStorage user info if needed
        if (typeof window !== "undefined") {
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem("user", JSON.stringify({ ...storedUser, ...result.data }));
        }
        
        router.refresh();
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Update Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }}
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal information</p>
        </div>
        <Badge className={`mt-2 md:mt-0 ${getRoleColor(userInfo.role)} px-4 py-1`}>
          {getRoleText(userInfo.role)}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Picture Section */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Profile Picture</h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {profilePicPreview ? (
                  <img
                    src={profilePicPreview}
                    alt={userInfo.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-3xl font-bold text-gray-600">
                    {getInitials(userInfo.name)}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                <Camera className="h-5 w-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </label>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{userInfo.name}</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{userInfo.email}</span>
                </div>
                {userInfo.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{userInfo.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="+880 1XXX XXX XXX"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>

            {/* Languages & Bio */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Languages & Bio
              </h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="languages">Languages (comma separated)</Label>
                  <Input
                    id="languages"
                    name="languages"
                    value={form.languages}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="English, Bengali, Spanish"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleInputChange}
                    disabled={loading}
                    rows={3}
                    placeholder="Tell about yourself..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Specific Information */}
        {userInfo.role === "guide" && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Briefcase className="h-6 w-6" />
              Guide Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="expertise">Areas of Expertise</Label>
                <Input
                  id="expertise"
                  name="expertise"
                  value={form.expertise}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="History, Food, Photography, Adventure"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate with commas
                </p>
              </div>

              <div>
                <Label htmlFor="dailyRate">Daily Rate ($)</Label>
                <Input
                  id="dailyRate"
                  name="dailyRate"
                  type="number"
                  value={form.dailyRate}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Your daily guiding rate
                </p>
              </div>
            </div>
          </div>
        )}

        {userInfo.role === "tourist" && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Star className="h-6 w-6" />
              Travel Preferences
            </h2>

            <div>
              <Label htmlFor="travelPreferences">Interests & Preferences</Label>
              <Input
                id="travelPreferences"
                name="travelPreferences"
                value={form.travelPreferences}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="Adventure, Culture, Food, History, Shopping"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate with commas
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="min-w-[150px]">
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
// "use client";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { getInitials } from "@/lib/formatters";
// import { updateMyProfile } from "@/services/auth/auth.service";
// import { UserInfo } from "@/types/user.interface";
// import { Camera, Loader2, Save } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState, useTransition } from "react";

// interface MyProfileProps {
//   userInfo: UserInfo;
// }

// const MyProfile = ({ userInfo }: MyProfileProps) => {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // const getProfilePhoto = () => {
//   //   if (userInfo.role === "admin") {
//   //     return userInfo.admin?.profilePhoto;
//   //   } else if (userInfo.role === "tourist") {
//   //     return userInfo.doctor?.profilePhoto;
//   //   } else if (userInfo.role === "guide") {
//   //     return userInfo.patient?.profilePhoto;
//   //   }
//   //   return null;
//   // };

//   const getProfileData = () => {
//     if (userInfo.role === "admin") {
//       return userInfo.admin;
//     } else if (userInfo.role === "DOCTOR") {
//       return userInfo.doctor;
//     } else if (userInfo.role === "PATIENT") {
//       return userInfo.patient;
//     }
//     return null;
//   };

//   const profilePhoto = getProfilePhoto();
//   const profileData = getProfileData();

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     const formData = new FormData(e.currentTarget);

//     startTransition(async () => {
//       const result = await updateMyProfile(formData);

//       if (result.success) {
//         setSuccess(result.message);
//         setPreviewImage(null);
//         router.refresh();
//       } else {
//         setError(result.message);
//       }
//     });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div>
//         <h1 className="text-3xl font-bold">My Profile</h1>
//         <p className="text-muted-foreground mt-1">
//           Manage your personal information
//         </p>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div className="grid gap-6 lg:grid-cols-3">
//           {/* Profile Card */}
//           <Card className="lg:col-span-1">
//             <CardHeader>
//               <CardTitle>Profile Picture</CardTitle>
//             </CardHeader>
//             <CardContent className="flex flex-col items-center space-y-4">
//               <div className="relative">
//                 <Avatar className="h-32 w-32">
//                   {previewImage || profilePhoto ? (
//                     <AvatarImage
//                       src={previewImage || (profilePhoto as string)}
//                       alt={userInfo.name}
//                     />
//                   ) : (
//                     <AvatarFallback className="text-3xl">
//                       {getInitials(userInfo.name)}
//                     </AvatarFallback>
//                   )}
//                 </Avatar>
//                 <label
//                   htmlFor="file"
//                   className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
//                 >
//                   <Camera className="h-4 w-4" />
//                   <Input
//                     type="file"
//                     id="file"
//                     name="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleImageChange}
//                     disabled={isPending}
//                   />
//                 </label>
//               </div>

//               <div className="text-center">
//                 <p className="font-semibold text-lg">{userInfo.name}</p>
//                 <p className="text-sm text-muted-foreground">
//                   {userInfo.email}
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-1 capitalize">
//                   {userInfo.role.replace("_", " ")}
//                 </p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Profile Information Card */}
//           <Card className="lg:col-span-2">
//             <CardHeader>
//               <CardTitle>Personal Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {error && (
//                 <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
//                   {error}
//                 </div>
//               )}

//               {success && (
//                 <div className="bg-green-500/10 text-green-600 px-4 py-3 rounded-md text-sm">
//                   {success}
//                 </div>
//               )}

//               <div className="grid gap-4 md:grid-cols-2">
//                 {/* Common Fields for All Roles */}
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Full Name</Label>
//                   <Input
//                     id="name"
//                     name="name"
//                     defaultValue={profileData?.name || userInfo.name}
//                     required
//                     disabled={isPending}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={userInfo.email}
//                     disabled
//                     className="bg-muted"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="contactNumber">Contact Number</Label>
//                   <Input
//                     id="contactNumber"
//                     name="contactNumber"
//                     defaultValue={profileData?.contactNumber || ""}
//                     required
//                     disabled={isPending}
//                   />
//                 </div>

//                 {/* Guide-Specific Fields */}
//                 {userInfo.role === "guide" && userInfo.guide && (
//                   <>
//                     <div className="space-y-2">
//                       <Label htmlFor="address">Address</Label>
//                       <Input
//                         id="address"
//                         name="address"
//                         defaultValue={userInfo.guide.address || ""}
//                         disabled={isPending}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="registrationNumber">
//                         Registration Number
//                       </Label>
//                       <Input
//                         id="registrationNumber"
//                         name="registrationNumber"
//                         defaultValue={userInfo.doctor.registrationNumber || ""}
//                         required
//                         disabled={isPending}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="experience">Experience (Years)</Label>
//                       <Input
//                         id="experience"
//                         name="experience"
//                         type="number"
//                         defaultValue={userInfo.doctor.experience || ""}
//                         disabled={isPending}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="appointmentFee">Appointment Fee</Label>
//                       <Input
//                         id="appointmentFee"
//                         name="appointmentFee"
//                         type="number"
//                         defaultValue={userInfo.doctor.appointmentFee || ""}
//                         required
//                         disabled={isPending}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="qualification">Qualification</Label>
//                       <Input
//                         id="qualification"
//                         name="qualification"
//                         defaultValue={userInfo.doctor.qualification || ""}
//                         required
//                         disabled={isPending}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="currentWorkingPlace">
//                         Current Working Place
//                       </Label>
//                       <Input
//                         id="currentWorkingPlace"
//                         name="currentWorkingPlace"
//                         defaultValue={userInfo.doctor.currentWorkingPlace || ""}
//                         required
//                         disabled={isPending}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="designation">Designation</Label>
//                       <Input
//                         id="designation"
//                         name="designation"
//                         defaultValue={userInfo.doctor.designation || ""}
//                         required
//                         disabled={isPending}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="gender">Gender</Label>
//                       <select
//                         id="gender"
//                         name="gender"
//                         defaultValue={userInfo.doctor.gender || "MALE"}
//                         className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                         disabled={isPending}
//                       >
//                         <option value="MALE">Male</option>
//                         <option value="FEMALE">Female</option>
//                       </select>
//                     </div>
//                   </>
//                 )}

//                 {/* Patient-Specific Fields */}
//                 {userInfo.role === "PATIENT" && userInfo.patient && (
//                   <div className="space-y-2 md:col-span-2">
//                     <Label htmlFor="address">Address</Label>
//                     <Input
//                       id="address"
//                       name="address"
//                       defaultValue={userInfo.patient.address || ""}
//                       disabled={isPending}
//                     />
//                   </div>
//                 )}
//               </div>

//               <div className="flex justify-end pt-4">
//                 <Button type="submit" disabled={isPending}>
//                   {isPending ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Updating...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="mr-2 h-4 w-4" />
//                       Save Changes
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default MyProfile;


 