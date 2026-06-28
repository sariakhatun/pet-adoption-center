import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import axios from "axios";
import { updateProfile } from "firebase/auth";

const ProfilePage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ pets: 0, adoptions: 0, campaigns: 0 });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const fetchProfile = async () => {
    try {
      const [profileRes, petsRes, adoptionsRes, campaignsRes] = await Promise.all([
        axiosSecure.get("/users/me"),
        axiosSecure.get(`/my-pets?page=0&limit=1`),
        axiosSecure.get(`/my-adoptions?page=0&limit=1`),
        axiosSecure.get(`/my-donations-campaign?email=${user?.email}`),
      ]);
      setProfile(profileRes.data);
      setStats({
        pets: petsRes.data?.total || 0,
        adoptions: adoptionsRes.data?.total || 0,
        campaigns: Array.isArray(campaignsRes.data) ? campaignsRes.data.length : 0,
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleEditClick = () => {
    reset({
      phone: profile?.phone || "",
      address: profile?.address || "",
      nid: profile?.nid || "",
      occupation: profile?.occupation || "",
      dateOfBirth: profile?.dateOfBirth || "",
      bio: profile?.bio || "",
    });
    setIsEditing(true);
  };

  const handlePhotoUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append("image", image);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Upload_Key}`,
        formData
      );
      const photoURL = res.data.data.url;
      await updateProfile(user, { photoURL });
      await axiosSecure.patch("/users/me", { photoURL });
      await Swal.fire({ icon: "success", title: "Photo updated!", showConfirmButton: false, timer: 1500 });
      fetchProfile();
    } catch {
      Swal.fire("Error", "Failed to update photo", "error");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axiosSecure.patch("/users/me", data);
      await Swal.fire({ icon: "success", title: "Profile updated!", showConfirmButton: false, timer: 1500 });
      setIsEditing(false);
      fetchProfile();
    } catch {
      Swal.fire("Error", "Failed to update profile", "error");
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;
  if (!profile) return <div className="p-6 text-center text-gray-500">User not found</div>;

  const initials = profile.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const fields = [
    { icon: "ti-phone", label: "Phone", value: profile.phone },
    { icon: "ti-id-badge", label: "NID number", value: profile.nid },
    { icon: "ti-briefcase", label: "Occupation", value: profile.occupation },
    {
      icon: "ti-cake", label: "Date of birth",
      value: profile.dateOfBirth
        ? new Date(profile.dateOfBirth).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })
        : null
    },
    { icon: "ti-map-pin", label: "Address", value: profile.address },
  ];

  return (
    <div style={{ padding: "1rem", fontFamily: "var(--font-sans)" }}>

      {/* Teal banner */}
      <div style={{
        height: 100, borderRadius: "12px 12px 0 0",
        background: "linear-gradient(135deg, #34B7A7 0%, #1D9E75 50%, #0F6E56 100%)",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.15,
          backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 60% 80%, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
      </div>

      {/* Header card */}
      <div style={{
        background: "var(--surface-2)", border: "0.5px solid var(--border)",
        borderRadius: "0 0 12px 12px", borderTop: "none",
        padding: "0 1.25rem 1.25rem", marginBottom: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>

            {/* Avatar */}
            <div style={{ position: "relative", display: "inline-block", marginTop: -36 }}>
              {profile.photoURL ? (
                <img src={profile.photoURL} alt="avatar" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--surface-2)" }} />
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 500, color: "#0F6E56", border: "3px solid var(--surface-2)" }}>
                  {initials}
                </div>
              )}
              <label style={{ position: "absolute", bottom: 2, right: 2, width: 22, height: 22, borderRadius: "50%", background: "#34B7A7", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "2px solid var(--surface-2)" }}>
                <i className={`ti ${uploadingPhoto ? "ti-loader-2" : "ti-camera"}`} style={{ fontSize: 12, color: "#fff", animation: uploadingPhoto ? "spin 1s linear infinite" : "none" }} aria-hidden="true" />
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
              </label>
            </div>

            <div style={{ paddingBottom: 4 }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: "var(--text-primary)" }}>{profile.name}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{profile.email}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 999, background: "#E1F5EE", color: "#0F6E56", textTransform: "capitalize" }}>
                  {profile.role || "user"}
                </span>
                <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 999, background: "var(--bg-success)", color: "var(--text-success)" }}>
                  {profile.status || "active"}
                </span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right", paddingBottom: 4 }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Member since</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
              {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1rem" }}>
        {[
          { num: stats.pets, label: "Pets added" },
          { num: stats.adoptions, label: "Adoptions" },
          { num: stats.campaigns, label: "Campaigns" },
        ].map(({ num, label }) => (
          <div key={label} style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: "#34B7A7" }}>{num}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {!isEditing ? (
        <>
          {/* Personal info section */}
          <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem" }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <i className="ti ti-user" style={{ fontSize: 14 }} aria-hidden="true" /> Personal info
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
              {fields.map(({ icon, label, value }) => (
                <div key={label} style={{ background: "var(--surface-1)", border: "0.5px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 15, color: "#34B7A7", marginBottom: 4 }}>
                    <i className={`ti ${icon}`} aria-hidden="true" />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 14, color: "var(--text-primary)" }}>{value || "Not provided"}</div>
                </div>
              ))}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div style={{ background: "var(--surface-1)", border: "0.5px solid var(--border)", borderLeft: "3px solid #34B7A7", borderRadius: 8, padding: "12px 14px", marginTop: 10 }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, marginBottom: 4 }}>
                  <i className="ti ti-quote" style={{ fontSize: 13, marginRight: 4 }} aria-hidden="true" />Bio
                </div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{profile.bio}</div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleEditClick}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", background: "#34B7A7", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" }}
            >
              <i className="ti ti-edit" style={{ fontSize: 15 }} aria-hidden="true" /> Edit profile
            </button>
          </div>
        </>
      ) : (
        /* Edit mode */
        <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "1.25rem" }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
            Edit profile
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 16 }}>
              {[
                { label: "Phone number", name: "phone", placeholder: "e.g. 01700000000" },
                { label: "NID number", name: "nid", placeholder: "Enter NID number" },
                { label: "Occupation", name: "occupation", placeholder: "e.g. Engineer, Teacher" },
              ].map(({ label, name, placeholder }) => (
                <div key={name}>
                  <Label style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>{label}</Label>
                  <Input placeholder={placeholder} {...register(name)} />
                </div>
              ))}

              <div>
                <Label style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Date of birth</Label>
                <Input type="date" {...register("dateOfBirth")} />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <Label style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Address</Label>
                <Input placeholder="Enter your address" {...register("address")} />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <Label style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Bio</Label>
                <textarea
                  placeholder="Tell something about yourself..."
                  {...register("bio")}
                  rows={3}
                  style={{ width: "100%", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "8px 12px", fontSize: 14, background: "var(--surface-2)", color: "var(--text-primary)", resize: "none", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#34B7A7] hover:bg-[#2a9d8f] text-white" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ProfilePage;