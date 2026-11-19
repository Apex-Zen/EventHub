"use client";
import { useState, useSyncExternalStore, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import VendorFields from "../component/auth/VendorFields";
import Link from "next/link";
import LandingPage from "../component/LandingPage";
import AuthHeader from "../component/AuthHeader";
import { useAuthFlow } from "../hooks/useAuthFlow";
import { getRoleMessage } from "../lib/auth";
import GoogleStatus from "../component/auth/GoogleStatus";
import ForgotPasswordForm from "../component/auth/ForgotPasswordForm";
import ResetPasswordForm from "../component/auth/ResetPasswordForm";
import VerifyEmailForm from "../component/auth/VerifyEmailForm";
import AccountForm from "../component/auth/AccountForm";

type GuestAnswer = "Yes" | "No" | "No reply" | "Not sent";

type GuestRecord = {
  id: number;
  name: string;
  phone: string;
  inviteSent: string;
  answer: GuestAnswer;
};

type IncidentRecord = {
  id: number;
  title: string;
  detail: string;
  status: "Open" | "Resolved";
};

type StaffNotification = {
  id: string;
  title: string;
  detail: string;
  actionLabel?: string;
  action?: "dashboard" | "incidents" | "invitations" | "chat" | "war-room";
  tone?: "late";
  read: boolean;
};

type TimelineTask = {
  id: number;
  time: string;
  task: string;
  who: string;
  status: string;
  statusType: "done" | "late" | "arrived" | "pending";
};

type WarRoomActivity = {
  id: number;
  occurredAt: number;
  message: string;
};

type ChatChannel = "client" | "vendor" | "staff";

type ChatMessage = {
  id: number;
  channel: ChatChannel;
  sender: string;
  role: string;
  body: string;
  sentAt: string;
  isOwn: boolean;
};

const initialGuests: GuestRecord[] = [
  { id: 1, name: "Chamari Senanayake", phone: "+94 77 210 4432", inviteSent: "19 Oct", answer: "Yes" },
  { id: 2, name: "Lahiru Bandara", phone: "+94 71 880 1290", inviteSent: "19 Oct", answer: "Yes" },
  { id: 3, name: "Anoma Rajapaksha", phone: "+94 76 455 9021", inviteSent: "19 Oct", answer: "No" },
  { id: 4, name: "Pradeep Kumara", phone: "+94 70 302 7781", inviteSent: "19 Oct", answer: "No reply" },
  { id: 5, name: "Sanduni Herath", phone: "+94 77 649 1180", inviteSent: "Not sent", answer: "Not sent" },
];

const initialGuestMessage = "Nadeesha and Tharindu invite you to their wedding on Saturday 12 December at Waters Edge, Battaramulla, from 6.30 pm.\n\nPlease let us know if you can come:\n\n eventhub.lk/r/7KQ2M";
const PROFILE_PHOTO_KEY = "eventhub.demo.profile-photo";
type ProfilePhotoSnapshot = { url: string; error: string | null };
const EMPTY_PROFILE_PHOTO: ProfilePhotoSnapshot = { url: "", error: null };
let profilePhotoSnapshot = EMPTY_PROFILE_PHOTO;
const profilePhotoListeners = new Set<() => void>();

function refreshProfilePhotoSnapshot() {
  try {
    profilePhotoSnapshot = {
      url: window.localStorage.getItem(PROFILE_PHOTO_KEY) ?? "",
      error: null,
    };
  } catch {
    profilePhotoSnapshot = {
      url: "",
      error: "Saved profile photo could not be loaded from this browser.",
    };
  }
  profilePhotoListeners.forEach((listener) => listener());
}

function subscribeToProfilePhoto(listener: () => void) {
  profilePhotoListeners.add(listener);
  function syncFromStorage(event: StorageEvent) {
    if (event.key === PROFILE_PHOTO_KEY || event.key === null) refreshProfilePhotoSnapshot();
  }
  window.addEventListener("storage", syncFromStorage);
  refreshProfilePhotoSnapshot();

  return () => {
    profilePhotoListeners.delete(listener);
    window.removeEventListener("storage", syncFromStorage);
  };
}

function getProfilePhotoSnapshot() {
  return profilePhotoSnapshot;
}

function getServerProfilePhotoSnapshot() {
  return EMPTY_PROFILE_PHOTO;
}

function updateProfilePhotoSnapshot(url: string) {
  profilePhotoSnapshot = { url, error: null };
  profilePhotoListeners.forEach((listener) => listener());
}

const initialChatMessages: ChatMessage[] = [
  { id: 1, channel: "client", sender: "Nadeesha Perera", role: "Client", body: "Hi Dilini, could you let me know if the event schedule is still on track?", sentAt: "2:10 pm", isOwn: false },
  { id: 2, channel: "client", sender: "Dilini Rajapaksa", role: "Staff", body: "The timeline is up to date. I’ll follow up here if any vendor timings change.", sentAt: "2:14 pm", isOwn: true },
  { id: 3, channel: "client", sender: "Shehan G.", role: "Event Manager", body: "Petal & Frame Decor is marked late in the timeline. I’m following up on their arrival.", sentAt: "2:20 pm", isOwn: false },
];

const initialTimelineTasks: TimelineTask[] = [
  { id: 1, time: "12:00", task: "Venue walk-through with Waters Edge", who: "Dilini R.", status: "Done", statusType: "done" },
  { id: 2, time: "13:00", task: "Share gate scan link with gate staff", who: "Dilini R.", status: "Done", statusType: "done" },
  { id: 3, time: "15:30", task: "Caterer arrives and checks in", who: "Ceylon Spice Caterers", status: "Done", statusType: "done" },
  { id: 4, time: "13:00", task: "Decor arrives and checks in", who: "Petal & Frame Decor", status: "Late 2.5 h", statusType: "late" },
  { id: 5, time: "16:30", task: "Photographer arrives", who: "Lens & Light Studio", status: "Arrived", statusType: "arrived" },
  { id: 6, time: "17:00", task: "Sound check", who: "SoundWave LK", status: "Pending", statusType: "pending" },
  { id: 7, time: "18:00", task: "Food tasting with the couple", who: "Ceylon Spice Caterers", status: "Pending", statusType: "pending" },
  { id: 8, time: "18:30", task: "Gates open, guests scan in", who: "Gate staff", status: "Pending", statusType: "pending" },
  { id: 9, time: "23:30", task: "Handover and mark completed", who: "Dilini R.", status: "Pending", statusType: "pending" },
];

function formatTimelineTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "pm" : "am";
  return `${hours % 12 || 12}.${String(minutes).padStart(2, "0")} ${period}`;
}

function formatGuestCount(count: number) {
  return `${count} ${count === 1 ? "guest" : "guests"}`;
}

const warRoomVendors = [
  { category: "PHOTOGRAPHY", name: "Lens & Light Studio" },
  { category: "CATERING", name: "Ceylon Spice Caterers" },
  { category: "DECORATION", name: "Petal & Frame Decor" },
  { category: "SOUND AND LIGHTS", name: "SoundWave LK" },
] as const;

const initialIncidents: IncidentRecord[] = [
  { id: 1, title: "Petal & Frame Decor is 2.5 h late", detail: "Today 3.10 pm · Shehan is on it", status: "Open" },
  { id: 2, title: "Caterer short of plates", detail: "7 Nov · resolved by Shehan G.", status: "Resolved" },
  { id: 3, title: "Gate queue too long", detail: "24 Oct · resolved", status: "Resolved" },
];

export default function Home() {
 const flow = useAuthFlow();
 const { showLanding, mode, step, role, activeAccount, switchMode, signOut, goHome, openAuth } = flow;
 const [activeSection, setActiveSection] = useState("Dashboard");
 const [timelineTasks, setTimelineTasks] = useState(initialTimelineTasks);
 const [warRoomActivity, setWarRoomActivity] = useState<WarRoomActivity[]>([]);
 const [chatChannel, setChatChannel] = useState<ChatChannel>("client");
 const [chatMessages, setChatMessages] = useState(initialChatMessages);
 const [newChatMessage, setNewChatMessage] = useState("");
 const [showTimelineTaskForm, setShowTimelineTaskForm] = useState(false);
 const [newTimelineTaskTime, setNewTimelineTaskTime] = useState("");
 const [newTimelineTaskName, setNewTimelineTaskName] = useState("");
 const [newTimelineTaskOwner, setNewTimelineTaskOwner] = useState("Dilini R.");
 const [taskToComplete, setTaskToComplete] = useState<TimelineTask | null>(null);
 const [guests, setGuests] = useState(initialGuests);
 const [guestSearch, setGuestSearch] = useState("");
 const [guestAnswerFilter, setGuestAnswerFilter] = useState("All answers");
 const [showGuestForm, setShowGuestForm] = useState(false);
 const [newGuestName, setNewGuestName] = useState("");
 const [newGuestPhone, setNewGuestPhone] = useState("");
 const [guestNotice, setGuestNotice] = useState("");
 const [guestMessage, setGuestMessage] = useState(initialGuestMessage);
 const [editingGuestMessage, setEditingGuestMessage] = useState(false);
 const [invitationAudience, setInvitationAudience] = useState("not-invited");
 const [invitationTemplate, setInvitationTemplate] = useState("wedding-si");
 const [personalNote, setPersonalNote] = useState("We would be honoured to have you with us.");
 const [invitationNotice, setInvitationNotice] = useState("");
 const [incidents, setIncidents] = useState(initialIncidents);
 const [incidentType, setIncidentType] = useState("Vendor late or missing");
 const [incidentVendor, setIncidentVendor] = useState("Petal & Frame Decor");
 const [incidentUrgency, setIncidentUrgency] = useState("High");
 const [incidentDetails, setIncidentDetails] = useState("Decor not here. Hall setup must finish by 5.30 pm. Phone not answered 3 times.");
 const [incidentAttachment, setIncidentAttachment] = useState("");
 const [incidentNotice, setIncidentNotice] = useState("");
 const [warRoomNotice, setWarRoomNotice] = useState("");
 const [showCompletionConfirm, setShowCompletionConfirm] = useState(false);
 const [eventCompleted, setEventCompleted] = useState(false);
 const [completionNotice, setCompletionNotice] = useState("");
 const [profileName, setProfileName] = useState("");
 const [profileEmail, setProfileEmail] = useState("");
 const [profilePhone, setProfilePhone] = useState("");
 const profilePhoto = useSyncExternalStore(
   subscribeToProfilePhoto,
   getProfilePhotoSnapshot,
   getServerProfilePhotoSnapshot
 );
 const profilePhotoUrl = profilePhoto.url;
 const [profileNotice, setProfileNotice] = useState("");
 const [currentPassword, setCurrentPassword] = useState("");
 const [newPassword, setNewPassword] = useState("");
 const [passwordNotice, setPasswordNotice] = useState("");
 const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
 const [notificationNotice, setNotificationNotice] = useState("");
 const displayedProfileNotice = profilePhoto.error ?? profileNotice;
 const displayedProfileName = profileName || activeAccount?.fullName || "Dilini Rajapaksa";
 const displayedProfileEmail = profileEmail || activeAccount?.email || "dilini@eventhub.lk";
 const displayedProfilePhone = profilePhone || activeAccount?.phoneNumber || activeAccount?.vendorProfile?.phoneNumber || "077 412 3388";
 const additionalCompletedTaskCount = timelineTasks.filter((task) =>
   task.statusType === "done" && !initialTimelineTasks.some((initialTask) => initialTask.id === task.id && initialTask.statusType === "done")
 ).length;
 const dashboardCompletedTaskCount = 9 + additionalCompletedTaskCount;
 const dashboardTotalTaskCount = 16 + Math.max(0, timelineTasks.length - initialTimelineTasks.length);
 const dashboardPendingTask = timelineTasks.find((task) => task.statusType === "pending");
 const dashboardUpNextTasks = timelineTasks.filter((task) => task.statusType !== "done").slice(0, 4);
 const vendorStatuses = warRoomVendors.map((vendor) => {
   const vendorTasks = timelineTasks.filter((task) => task.who === vendor.name);
   const arrivalTask = vendorTasks
     .filter((task) => /arriv|check.?in/i.test(task.task))
     .sort((a, b) => b.time.localeCompare(a.time))[0];
   const latestRelevantTask = arrivalTask ?? vendorTasks.sort((a, b) => a.time.localeCompare(b.time))[0];
   const statusType = arrivalTask?.statusType === "late"
     ? "late"
     : arrivalTask && (arrivalTask.statusType === "done" || arrivalTask.statusType === "arrived")
       ? "arrived"
       : "pending";
   const status = statusType === "late" ? "Late" : statusType === "arrived" ? "Arrived" : "Pending";
   const detail = latestRelevantTask
     ? arrivalTask
       ? `${statusType === "arrived" ? "Timeline marks arrival" : statusType === "late" ? "Timeline marks late" : "Arrival scheduled"} · ${formatTimelineTime(arrivalTask.time)}`
       : `${latestRelevantTask.task} · ${formatTimelineTime(latestRelevantTask.time)}`
     : "No tasks assigned on the timeline";
   return { ...vendor, status, statusType, detail };
 });
 const arrivedVendorCount = vendorStatuses.filter((vendor) => vendor.statusType === "arrived").length;
 const pendingVendorCount = vendorStatuses.filter((vendor) => vendor.statusType === "pending").length;
 const lateVendorCount = vendorStatuses.filter((vendor) => vendor.statusType === "late").length;
 const completionTaskCount = timelineTasks.filter((task) => task.statusType === "done" || task.statusType === "arrived").length;
 const guestCounts = {
   total: guests.length,
   invited: guests.filter((guest) => guest.inviteSent !== "Not sent").length,
   yes: guests.filter((guest) => guest.answer === "Yes").length,
   no: guests.filter((guest) => guest.answer === "No").length,
   noReply: guests.filter((guest) => guest.answer === "No reply").length,
   notSent: guests.filter((guest) => guest.inviteSent === "Not sent").length,
 };
 const invitationRecipientCount = invitationAudience === "all"
   ? guestCounts.total
   : invitationAudience === "no-reply"
     ? guestCounts.noReply
     : invitationAudience === "yes"
       ? guestCounts.yes
       : guestCounts.notSent;
 const confirmedGuestCount = guestCounts.yes;
 const invitedGuestCount = guestCounts.invited;
 const openIncidentCount = incidents.filter((incident) => incident.status === "Open").length;
 const resolvedIncidentCount = incidents.filter((incident) => incident.status === "Resolved").length;
 const notificationRecords: Omit<StaffNotification, "read">[] = [
   ...warRoomActivity.map((activity) => ({
     id: `activity-${activity.id}`,
     title: "Event activity",
     detail: `${new Date(activity.occurredAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · ${activity.message}`,
     actionLabel: "View dashboard",
     action: "dashboard" as const,
   })),
   ...incidents.filter((incident) => incident.status === "Open").map((incident) => ({
     id: `incident-${incident.id}`,
     title: "Open incident",
     detail: incident.title,
     actionLabel: "View incident",
     action: "incidents" as const,
   })),
   ...vendorStatuses.filter((vendor) => vendor.statusType === "late").map((vendor) => ({
     id: `vendor-late-${vendor.name}-${vendor.detail}`,
     title: "Vendor arrival is late",
     detail: `${vendor.name} · ${vendor.detail}`,
     actionLabel: "View War Room",
     action: "war-room" as const,
   })),
   ...(guestCounts.notSent > 0 ? [{
     id: `guests-not-invited-${guestCounts.notSent}`,
     title: "Guests not yet invited",
     detail: `${formatGuestCount(guestCounts.notSent)} in the current guest list ${guestCounts.notSent === 1 ? "has" : "have"} not been invited.`,
     actionLabel: "Review guests",
     action: "invitations" as const,
   }] : []),
 ];
 const notifications: StaffNotification[] = notificationRecords.map((notification) => ({
   ...notification,
   read: readNotificationIds.includes(notification.id),
 }));
 const unreadNotificationCount = notifications.filter((notification) => !notification.read).length;

 function recordWarRoomActivity(message: string) {
   const occurredAt = Date.now();
   setWarRoomActivity((current) => {
     const id = current.length > 0 ? Math.max(occurredAt, current[0].id + 1) : occurredAt;
     return [{ id, occurredAt, message }, ...current].slice(0, 8);
   });
 }

 function completeTimelineTask() {
   if (!taskToComplete) return;
   const completedTask = taskToComplete;
   const isArrivalTask = /arriv|check.?in/i.test(completedTask.task);
   setTimelineTasks((current) => current.map((task) =>
     task.id === completedTask.id
       ? { ...task, status: "Done", statusType: "done" }
       : task
   ));
   if (isArrivalTask) {
     const resolvedIncidents = incidents.filter((incident) =>
       incident.status === "Open" &&
       incident.title.includes(completedTask.who) &&
       /late|missing/i.test(incident.title)
     );
     if (resolvedIncidents.length > 0) {
       const resolvedAt = new Date().toLocaleString();
       setIncidents((current) => current.map((incident) =>
         resolvedIncidents.some((resolved) => resolved.id === incident.id)
           ? { ...incident, status: "Resolved", detail: `Resolved at ${resolvedAt} after arrival was recorded in the timeline.` }
           : incident
       ));
       resolvedIncidents.forEach((incident) => recordWarRoomActivity(`Incident resolved: ${incident.title}.`));
     }
   }
   recordWarRoomActivity(`${completedTask.who} marked “${completedTask.task}” complete.`);
   setTaskToComplete(null);
   setActiveSection("Dashboard");
 }

 function addTimelineTask(event: FormEvent<HTMLFormElement>) {
   event.preventDefault();
   const task = newTimelineTaskName.trim();
   const who = newTimelineTaskOwner.trim();
   if (!task || !newTimelineTaskTime || !who) return;

   const addedTask: TimelineTask = {
     id: Date.now(),
     time: newTimelineTaskTime,
     task,
     who,
     status: "Pending",
     statusType: "pending",
   };
   setTimelineTasks((current) => [...current, addedTask].sort((a, b) => a.time.localeCompare(b.time)));
   recordWarRoomActivity(`Timeline task added: “${task}” for ${who} at ${formatTimelineTime(newTimelineTaskTime)}.`);
   setNewTimelineTaskTime("");
   setNewTimelineTaskName("");
   setNewTimelineTaskOwner("Dilini R.");
   setShowTimelineTaskForm(false);
 }

 function changeProfilePhoto(event: ChangeEvent<HTMLInputElement>) {
   const input = event.currentTarget;
   const file = input.files?.[0];
   if (!file) return;
   if (!file.type.startsWith("image/")) {
     setProfileNotice("Choose an image file for your profile photo.");
     input.value = "";
     return;
   }
   if (file.size > 1024 * 1024) {
     setProfileNotice("Choose an image smaller than 1 MB.");
     input.value = "";
     return;
   }

   const reader = new FileReader();
   reader.onload = () => {
     if (typeof reader.result !== "string") {
       setProfileNotice("The selected photo could not be read.");
       return;
     }
     try {
       window.localStorage.setItem(PROFILE_PHOTO_KEY, reader.result);
         updateProfilePhotoSnapshot(reader.result);
       setProfileNotice("Profile photo updated across EventHub in this browser.");
     } catch {
       setProfileNotice("The photo could not be saved. Choose a smaller image and try again.");
     }
   };
   reader.onerror = () => setProfileNotice("The selected photo could not be read. Choose another image.");
   reader.readAsDataURL(file);
   input.value = "";
 }

 const visibleGuests = guests.filter((guest) => {
   const matchesSearch = `${guest.name} ${guest.phone}`.toLowerCase().includes(guestSearch.trim().toLowerCase());
   const matchesAnswer = guestAnswerFilter === "All answers" || guest.answer === guestAnswerFilter;
   return matchesSearch && matchesAnswer;
 });

 function addGuest(event: FormEvent<HTMLFormElement>) {
   event.preventDefault();
   const name = newGuestName.trim();
   const phone = newGuestPhone.trim();
   if (!name || !phone) return;
   setGuests((current) => [...current, {
     id: Date.now(),
     name,
     phone,
     inviteSent: "Not sent",
     answer: "Not sent",
   }]);
   setNewGuestName("");
   setNewGuestPhone("");
   setShowGuestForm(false);
   setGuestNotice(`${name} was added to the guest list.`);
   recordWarRoomActivity(`${name} added to the guest list.`);
 }

 async function importGuestCsv(event: ChangeEvent<HTMLInputElement>) {
   const input = event.currentTarget;
   const file = input.files?.[0];
   if (!file) return;
   try {
     const rows = (await file.text()).split(/\r?\n/).slice(1).filter((row) => row.trim());
     const imported: GuestRecord[] = [];
     rows.forEach((row, index) => {
       const [name = "", phone = ""] = row.split(",").map((value) => value.trim().replace(/^"|"$/g, ""));
       if (name && phone) imported.push({ id: Date.now() + index, name, phone, inviteSent: "Not sent", answer: "Not sent" });
     });
     if (imported.length === 0) throw new Error("CSV should have Name and WhatsApp columns with at least one guest.");
     setGuests((current) => [...current, ...imported]);
     setGuestNotice(`${imported.length} guest${imported.length === 1 ? "" : "s"} imported.`);
     recordWarRoomActivity(`${imported.length} guest${imported.length === 1 ? "" : "s"} imported to the guest list.`);
   } catch (cause) {
     setGuestNotice(cause instanceof Error ? cause.message : "The CSV could not be imported.");
   } finally {
     input.value = "";
   }
 }

 function submitIncident(event: FormEvent<HTMLFormElement>) {
   event.preventDefault();
   const occurredAt = Date.now();
   setIncidents((current) => [{
     id: occurredAt,
     title: `${incidentVendor} · ${incidentType.toLowerCase()}`,
     detail: `${new Date(occurredAt).toLocaleString()} · ${incidentUrgency} urgency · ${incidentDetails.trim()}${incidentAttachment ? ` · ${incidentAttachment}` : ""}`,
     status: "Open",
   }, ...current]);
   recordWarRoomActivity(`Incident raised for ${incidentVendor}: ${incidentType}.`);
   setIncidentNotice("Incident recorded in this event workspace. External notifications are not connected.");
 }

 function sendChatMessage(event: FormEvent<HTMLFormElement>) {
   event.preventDefault();
   const body = newChatMessage.trim();
   if (!body) return;

   const sentAt = new Date();
   setChatMessages((current) => [...current, {
     id: sentAt.getTime() + current.length,
     channel: chatChannel,
     sender: displayedProfileName,
     role: "Staff",
     body,
     sentAt: sentAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
     isOwn: true,
   }]);
   recordWarRoomActivity(`Message added to the ${chatChannel} chat channel.`);
   setNewChatMessage("");
 }

 function completeEvent() {
   setEventCompleted(true);
   setShowCompletionConfirm(false);
   setCompletionNotice("Event marked completed in this workspace. Vendor payouts are not connected.");
   recordWarRoomActivity("Event marked completed.");
   setActiveSection("Dashboard");
 }

 function saveProfile(event: FormEvent<HTMLFormElement>) {
   event.preventDefault();
   setProfileName((current) => current.trim());
   setProfileEmail((current) => current.trim());
   setProfilePhone((current) => current.trim());
   setProfileNotice("Profile changes are saved for this session only.");
 }

 function updatePassword(event: FormEvent<HTMLFormElement>) {
   event.preventDefault();
   setPasswordNotice("Password updates are not connected in this demo.");
 }

 function markAllNotificationsRead() {
   setReadNotificationIds((current) => [...new Set([...current, ...notifications.map((notification) => notification.id)])]);
   setNotificationNotice("All current notifications marked as read for this session.");
 }

 function openNotification(notification: StaffNotification) {
   setReadNotificationIds((current) => current.includes(notification.id) ? current : [...current, notification.id]);
   setNotificationNotice("");
   if (notification.action === "dashboard") setActiveSection("Dashboard");
   if (notification.action === "incidents") {
     setIncidentNotice("");
     setActiveSection("Incidents");
   }
   if (notification.action === "invitations") {
     setInvitationNotice("");
     setInvitationAudience("not-invited");
     setActiveSection("Invitations");
   }
   if (notification.action === "chat") {
     setChatChannel("client");
     setActiveSection("Chat");
   }
   if (notification.action === "war-room") setActiveSection("War Room");
 }

  if (step === "dashboard" || (!showLanding && step === "form")) {
    return (
      <main className="event-dashboard">
        <aside className="dashboard-sidebar">
          <div className="dashboard-brand">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" />
              <circle cx="12" cy="9" r="2.1" />
            </svg>
            <span>EventHub</span>
          </div>

          <div className="dashboard-event-select">
            <label>STAFF</label>
            <div className="event-select-row">
              <strong>Event</strong>
              <button type="button" aria-label="Select event">
                <span>Perera–Silva wedding</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
              </button>
            </div>
          </div>

          <nav className="dashboard-nav" aria-label="Dashboard navigation">
            {["Dashboard", "Timeline", "Guests", "Invitations", "War Room", "Incidents", "Completion", "Chat", "Notifications", "Profile"].map((item) => (
              <button
                className={item === activeSection ? "active" : ""}
                type="button"
                key={item}
                onClick={() => setActiveSection(item)}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="dashboard-profile">
            <div className="profile-avatar" aria-hidden="true">
              {profilePhotoUrl
                ? <Image src={profilePhotoUrl} alt="" width={31} height={31} unoptimized />
                : displayedProfileName.split(" ").map((part) => part[0]).slice(0, 2).join("")}
            </div>
            <div>
              <strong>{displayedProfileName}</strong>
              <span>Staff</span>
            </div>
            <button type="button" onClick={signOut} aria-label="Sign out">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" /></svg>
            </button>
          </div>
        </aside>

        <section className="dashboard-content">
          {activeSection === "War Room" ? (
            <section className="war-room-page">
              <header className="war-room-header">
                <div>
                  <h1>War Room</h1>
                  <p>Perera–Silva wedding · live</p>
                </div>
                <button type="button" className="war-room-raise-button" onClick={() => { setWarRoomNotice(""); setIncidentNotice(""); setActiveSection("Incidents"); }}>
                  Raise incident
                </button>
              </header>

              <div className="war-room-view-notice">
                Live from this event’s timeline and incident list. External vendor check-ins and messaging are not connected.
              </div>

              {warRoomNotice && <p className="war-room-status-notice" role="status">{warRoomNotice}</p>}

              <section className="war-room-vendor-grid" aria-label="Vendor arrival status">
                {vendorStatuses.map((vendor) => (
                  <article className="war-room-vendor-card" key={vendor.name}>
                    <p className="war-room-vendor-category">{vendor.category}</p>
                    <h2>{vendor.name}</h2>
                    <span className={`war-room-status ${vendor.statusType}`}>{vendor.status}</span>
                    <p className="war-room-vendor-detail">{vendor.detail}</p>
                    <div className="war-room-vendor-actions">
                      <button type="button" onClick={() => setWarRoomNotice(`Calling ${vendor.name} is not connected in this demo.`)}>Call</button>
                      <button type="button" onClick={() => setWarRoomNotice(`Messaging ${vendor.name} is not connected in this demo.`)}>Message</button>
                    </div>
                  </article>
                ))}
              </section>

              <section className="war-room-activity-card" aria-label="Open incidents">
                <h2>Open incidents · {openIncidentCount}</h2>
                {incidents.filter((incident) => incident.status === "Open").length > 0
                  ? incidents.filter((incident) => incident.status === "Open").map((incident) => (
                    <article key={incident.id}>
                      <strong>{incident.title}</strong>
                      <span>{incident.detail}</span>
                    </article>
                  ))
                  : <p className="war-room-empty-activity">No open incidents for this event.</p>}
              </section>

              <section className="war-room-activity-card" aria-label="War Room activity">
                <h2>Activity</h2>
                {warRoomActivity.length > 0 ? warRoomActivity.map((activity) => (
                  <article key={activity.id}>
                    <strong>{new Date(activity.occurredAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</strong>
                    <span>{activity.message}</span>
                  </article>
                )) : (
                  <p className="war-room-empty-activity">No activity recorded in this session yet. Timeline and incident updates will appear here.</p>
                )}
              </section>

            </section>
          ) : activeSection === "Incidents" ? (
            <section className="incidents-page">
              <header className="incidents-header">
                <h1>Raise an incident</h1>
                <p>Tell the Event Manager about a problem right away.</p>
              </header>

              {incidentNotice && <p className="incidents-notice" role="status">{incidentNotice}</p>}

              <div className="incidents-layout">
                <form className="incident-form-card" onSubmit={submitIncident}>
                  <label className="incident-field">
                    Event
                    <select defaultValue="Perera–Silva wedding">
                      <option>Perera–Silva wedding</option>
                    </select>
                  </label>

                  <div className="incident-field-row">
                    <label className="incident-field">
                      Type
                      <select value={incidentType} onChange={(event) => setIncidentType(event.target.value)}>
                        <option>Vendor late or missing</option>
                        <option>Guest safety concern</option>
                        <option>Venue or equipment problem</option>
                        <option>Other</option>
                      </select>
                    </label>
                    <label className="incident-field">
                      Vendor
                      <select value={incidentVendor} onChange={(event) => setIncidentVendor(event.target.value)}>
                        {vendorStatuses.map((vendor) => <option key={vendor.name}>{vendor.name}</option>)}
                      </select>
                    </label>
                    <label className="incident-field">
                      Urgency
                      <select value={incidentUrgency} onChange={(event) => setIncidentUrgency(event.target.value)}>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </label>
                  </div>

                  <label className="incident-field">
                    What happened?
                    <textarea required value={incidentDetails} onChange={(event) => setIncidentDetails(event.target.value)} />
                  </label>

                  <label className="incident-attachment">
                    <input type="file" accept="image/*,audio/*" onChange={(event) => setIncidentAttachment(event.currentTarget.files?.[0]?.name ?? "")} />
                    <strong>{incidentAttachment || "Add a photo or voice note"}</strong>
                    <span>{incidentAttachment ? "Attached" : "Optional"}</span>
                  </label>

                  <button type="submit" className="incident-submit-button">Send to Event Manager</button>
                </form>

                <aside className="incidents-list-card">
                  <h2>Your incidents</h2>
                  <div className="incidents-list">
                    {incidents.map((incident) => (
                      <article className="incident-list-item" key={incident.id}>
                        <div>
                          <strong>{incident.title}</strong>
                          <span>{incident.detail}</span>
                        </div>
                        <b className={`incident-list-status ${incident.status.toLowerCase()}`}>{incident.status}</b>
                      </article>
                    ))}
                  </div>
                </aside>
              </div>
            </section>
          ) : activeSection === "Chat" ? (
            <section className="chat-page">
              <header className="chat-page-header">
                <h1>Chat</h1>
                <p>Conversations for events you’re assigned to.</p>
              </header>

              <div className="chat-layout">
                <aside className="chat-conversation-list" aria-label="Event conversations">
                  <button type="button" className="chat-conversation active" onClick={() => setChatChannel("client")}>
                    <strong>Perera–Silva wedding</strong>
                    <span>{chatMessages.slice(-1)[0]?.body ?? "No messages yet"}</span>
                    <small>Waters Edge · Sat 12 Dec</small>
                  </button>
                </aside>

                <section className="chat-panel" aria-label="Event conversation">
                  <header className="chat-panel-header">
                    <h2>Perera–Silva wedding</h2>
                    <div className="chat-channel-tabs" role="tablist" aria-label="Conversation channels">
                      {([
                        ["client", "Client channel"],
                        ["vendor", "Vendor channel"],
                        ["staff", "Staff only"],
                      ] as const).map(([channel, label]) => (
                        <button
                          key={channel}
                          id={`chat-tab-${channel}`}
                          type="button"
                          role="tab"
                          aria-selected={chatChannel === channel}
                          className={chatChannel === channel ? "active" : ""}
                          onClick={() => setChatChannel(channel)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </header>

                  <div className="chat-message-list" role="tabpanel" aria-labelledby={`chat-tab-${chatChannel}`}>
                    {chatMessages.filter((message) => message.channel === chatChannel).length > 0
                      ? chatMessages.filter((message) => message.channel === chatChannel).map((message) => (
                        <article className={`chat-message${message.isOwn ? " own" : ""}`} key={message.id}>
                          <div className="chat-message-meta">{message.isOwn ? "You" : message.sender} · {message.role} · {message.sentAt}</div>
                          <p>{message.body}</p>
                        </article>
                      ))
                      : <p className="chat-empty-state">No messages in this channel yet.</p>}
                  </div>

                  <form className="chat-compose-form" onSubmit={sendChatMessage}>
                    <label htmlFor="chat-message-input">
                      Message to {chatChannel === "client" ? "the client" : chatChannel === "vendor" ? "the vendor channel" : "the staff channel"}
                    </label>
                    <div>
                      <input
                        id="chat-message-input"
                        type="text"
                        value={newChatMessage}
                        onChange={(event) => setNewChatMessage(event.target.value)}
                        placeholder="Type a message"
                        maxLength={1000}
                        required
                      />
                      <button type="submit">Send</button>
                    </div>
                    <p>Messages are saved in this session only; external delivery is not connected.</p>
                  </form>
                </section>
              </div>
            </section>
          ) : activeSection === "Completion" ? (
            <section className="completion-page">
              <header className="completion-header">
                <div>
                  <h1>Event completion</h1>
                  <p>Perera–Silva wedding · Sat 12 Dec · {eventCompleted ? "Completed" : "In progress"}</p>
                </div>
                <button
                  type="button"
                  className="completion-open-button"
                  onClick={() => setShowCompletionConfirm(true)}
                  disabled={eventCompleted}
                >
                  {eventCompleted ? "Event completed" : "Mark as completed"}
                </button>
              </header>

              {completionNotice && <p className="completion-page-notice" role="status">{completionNotice}</p>}

              <section className="completion-summary-grid" aria-label="Vendor completion summary">
                <article className="completion-summary-card arrived">
                  <span>{arrivedVendorCount}</span><strong>Arrived</strong>
                </article>
                <article className="completion-summary-card pending">
                  <span>{pendingVendorCount}</span><strong>Pending</strong>
                </article>
                <article className="completion-summary-card late">
                  <span>{lateVendorCount}</span><strong>Late / alert</strong>
                </article>
              </section>

              <p className="completion-refresh">
                Live event data · {completionTaskCount} of {timelineTasks.length} timeline tasks complete · {openIncidentCount} open incidents
              </p>

              <div className="completion-content-grid">
                <section className="completion-vendor-grid" aria-label="Vendor completion details">
                  {vendorStatuses.map((vendor) => (
                    <article className={`completion-vendor-card ${vendor.statusType}`} key={vendor.name}>
                      <p>{vendor.category}</p>
                      <div className="completion-vendor-title">
                        <span aria-hidden="true">{vendor.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span>
                        <h2>{vendor.name}</h2>
                      </div>
                      <b>{vendor.status}</b>
                      <p className="completion-vendor-detail">{vendor.detail}</p>
                      <p className="completion-vendor-stage">
                        {vendor.statusType === "arrived" ? "Arrival recorded in timeline" : vendor.statusType === "late" ? "Arrival is marked late in timeline" : "Awaiting arrival update in timeline"}
                      </p>
                      <div className="completion-vendor-actions">
                        <button type="button" onClick={() => setCompletionNotice(`Calling ${vendor.name} is not connected in this demo.`)}>Call</button>
                        <button type="button" onClick={() => setCompletionNotice(`Messaging ${vendor.name} is not connected in this demo.`)}>Message</button>
                      </div>
                    </article>
                  ))}
                </section>

                <aside className="completion-side-column">
                  <section className="completion-code-card">
                    <h2>Current event status</h2>
                    <strong>{completionTaskCount}/{timelineTasks.length}</strong>
                    <p>Timeline tasks complete.</p>
                    <p>{arrivedVendorCount} of {vendorStatuses.length} vendors marked arrived.</p>
                    <p>{guestCounts.yes} of {guestCounts.total} guests have confirmed.</p>
                    <p>{openIncidentCount} open {openIncidentCount === 1 ? "incident" : "incidents"}.</p>
                  </section>
                  <section className="completion-activity-card">
                    <h2>Activity</h2>
                    {warRoomActivity.length > 0 ? warRoomActivity.map((activity) => (
                      <article key={activity.id}>
                        <b>{new Date(activity.occurredAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</b>
                        <span>{activity.message}</span>
                      </article>
                    )) : (
                      <p className="completion-activity-empty">No activity recorded in this session yet.</p>
                    )}
                  </section>
                </aside>
              </div>

              {showCompletionConfirm && (
                <div className="completion-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowCompletionConfirm(false); }}>
                  <section className="completion-modal" role="dialog" aria-modal="true" aria-labelledby="completion-modal-title">
                    <h2 id="completion-modal-title">Mark Perera–Silva wedding as completed?</h2>
                    <p className="completion-modal-description">Do this when the event has ended. It cannot be undone.</p>
                    <div className="completion-payout-list">
                      <strong>LIVE EVENT CHECK</strong>
                      <p><span>Timeline tasks complete</span><b>{completionTaskCount} of {timelineTasks.length}</b></p>
                      <p><span>Vendors arrived</span><b>{arrivedVendorCount} of {vendorStatuses.length}</b></p>
                      <p><span>Open incidents</span><b>{openIncidentCount}</b></p>
                    </div>
                    {openIncidentCount > 0 && (
                      <div className="completion-warning">
                        <strong aria-hidden="true">!</strong>
                        <span>{openIncidentCount} open {openIncidentCount === 1 ? "incident remains" : "incidents remain"}: {incidents.filter((incident) => incident.status === "Open").map((incident) => incident.title).join("; ")}</span>
                      </div>
                    )}
                    <p className="completion-demo-note">Completion updates this workspace. Vendor payments are not connected.</p>
                    <div className="completion-modal-actions">
                      <button type="button" className="completion-cancel-button" onClick={() => setShowCompletionConfirm(false)}>Cancel</button>
                      <button type="button" className="completion-confirm-button" onClick={completeEvent}>Mark completed</button>
                    </div>
                  </section>
                </div>
              )}
            </section>
          ) : activeSection === "Notifications" ? (
            <section className="notifications-page">
              <header className="notifications-header">
                <div>
                  <h1>Notifications</h1>
                  <p>{unreadNotificationCount} unread · Updates from this event workspace</p>
                </div>
                <button type="button" onClick={markAllNotificationsRead}>Mark all as read</button>
              </header>

              {notificationNotice && <p className="notifications-notice" role="status">{notificationNotice}</p>}

              <section className="notifications-list-card" aria-label="Notifications">
                {notifications.length > 0 ? notifications.map((notification) => (
                  <article className={`notification-row${notification.read ? " read" : " unread"}`} key={notification.id}>
                    <div className="notification-copy">
                      <strong>{notification.title}</strong>
                      <span>{notification.detail}</span>
                    </div>
                    <div className="notification-action">
                      {notification.tone === "late" ? (
                        <span className="notification-late-badge">{notification.actionLabel}</span>
                      ) : notification.action ? (
                        <button type="button" onClick={() => openNotification(notification)}>{notification.actionLabel}</button>
                      ) : (
                        <span>{notification.actionLabel}</span>
                      )}
                    </div>
                  </article>
                )) : <p className="notifications-empty-state">No current event notifications.</p>}
              </section>
            </section>
          ) : activeSection === "Profile" ? (
            <section className="profile-page">
              <header className="profile-header">
                <h1>Profile</h1>
                <p>Your staff profile and current event activity.</p>
              </header>

              <div className="profile-layout">
                <section className="profile-details-card">
                  <h2>Details</h2>
                  {displayedProfileNotice && <p className="profile-notice" role="status">{displayedProfileNotice}</p>}
                  <div className="profile-photo-row">
                    <div className="profile-photo" aria-label="Profile photo">
                      {profilePhotoUrl
                        ? <Image src={profilePhotoUrl} alt={`${displayedProfileName} profile`} width={56} height={56} unoptimized />
                        : <span>{displayedProfileName.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>}
                    </div>
                    <label className="profile-photo-button">
                      <input
                        type="file"
                        accept="image/*"
                        aria-label="Change profile photo"
                        onChange={changeProfilePhoto}
                      />
                      Change photo
                    </label>
                  </div>

                  <form className="profile-details-form" onSubmit={saveProfile}>
                    <label>
                      Full name
                      <input required value={displayedProfileName} onChange={(event) => setProfileName(event.target.value)} />
                    </label>
                    <label>
                      Role
                      <input value="Staff" readOnly />
                    </label>
                    <label>
                      Email
                      <input type="email" required value={displayedProfileEmail} onChange={(event) => setProfileEmail(event.target.value)} />
                    </label>
                    <label>
                      Phone
                      <input type="tel" required value={displayedProfilePhone} onChange={(event) => setProfilePhone(event.target.value)} />
                    </label>
                    <button type="submit" className="profile-save-button">Save changes</button>
                  </form>
                </section>

                <div className="profile-side-column">
                  <section className="profile-password-card">
                    <h2>Password</h2>
                    <form onSubmit={updatePassword}>
                      <label>
                        Current password
                        <input
                          type="password"
                          autoComplete="current-password"
                          placeholder="••••••••"
                          value={currentPassword}
                          onChange={(event) => setCurrentPassword(event.target.value)}
                          required
                        />
                      </label>
                      <label>
                        New password
                        <input
                          type="password"
                          autoComplete="new-password"
                          placeholder="At least 8 characters"
                          minLength={8}
                          value={newPassword}
                          onChange={(event) => setNewPassword(event.target.value)}
                          required
                        />
                      </label>
                      <button type="submit" className="profile-password-button">Update password</button>
                    </form>
                    {passwordNotice && <p className="profile-notice" role="status">{passwordNotice}</p>}
                  </section>

                  <section className="profile-month-card">
                    <h2>Current event</h2>
                    <dl>
                      <div><dt>Event status</dt><dd>{eventCompleted ? "Completed" : "In progress"}</dd></div>
                      <div><dt>Guests in list</dt><dd>{guestCounts.total}</dd></div>
                      <div><dt>Timeline tasks</dt><dd>{completionTaskCount} of {timelineTasks.length}</dd></div>
                      <div><dt>Open incidents</dt><dd>{openIncidentCount}</dd></div>
                      <div><dt>Resolved incidents</dt><dd>{resolvedIncidentCount}</dd></div>
                    </dl>
                  </section>
                </div>
              </div>
            </section>
          ) : activeSection === "Invitations" ? (
            <section className="invitation-page">
              <header className="invitation-header">
                <button type="button" className="invitation-back" onClick={() => setActiveSection("Guests")}>
                  <span aria-hidden="true">←</span> Guest list
                </button>
                <h1>Send invitation</h1>
                <p>Perera–Silva wedding · invitations are prepared for the EventHub WhatsApp number</p>
              </header>

              <div className="invitation-grid">
                <section className="invitation-compose-card">
                  <h2>Message</h2>
                  <label htmlFor="invitation-audience">Send to</label>
                  <select id="invitation-audience" value={invitationAudience} onChange={(event) => setInvitationAudience(event.target.value)}>
                    <option value="not-invited">Not yet invited ({formatGuestCount(guestCounts.notSent)})</option>
                    <option value="all">All guests ({formatGuestCount(guestCounts.total)})</option>
                    <option value="no-reply">Guests with no reply ({formatGuestCount(guestCounts.noReply)})</option>
                    <option value="yes">Guests who replied Yes ({formatGuestCount(guestCounts.yes)})</option>
                  </select>

                  <label htmlFor="invitation-template">Template</label>
                  <select id="invitation-template" value={invitationTemplate} onChange={(event) => setInvitationTemplate(event.target.value)}>
                    <option value="wedding-si">Wedding invitation (English + Sinhala)</option>
                    <option value="wedding-en">Wedding invitation (English)</option>
                    <option value="save-date">Save the date</option>
                  </select>

                  <label htmlFor="invitation-note">Personal note</label>
                  <input id="invitation-note" value={personalNote} onChange={(event) => setPersonalNote(event.target.value)} />

                  <div className="invitation-channel-pills">
                    <span>WhatsApp</span>
                    <span>SMS fallback</span>
                  </div>

                  <div className="invitation-actions">
                    <button type="button" className="invitation-send-button" onClick={() => setActiveSection("Guests")}>
                      Send to {formatGuestCount(invitationRecipientCount)}
                    </button>
                    <button type="button" className="invitation-test-button" onClick={() => setInvitationNotice("A test invitation is ready for your registered number.")}>
                      Send a test to me
                    </button>
                  </div>
                  {invitationNotice && <p className="invitation-notice" role="status">{invitationNotice}</p>}
                </section>

                <aside className="invitation-preview-card">
                  <h2>Preview</h2>
                  <div className="invitation-preview">
                    <div className="invitation-preview-message">
                      <p>Dear Kamal, Nadeesha and Tharaka invite you to their wedding on Sat 12 Dec at Waters Edge, Battaramulla. Please RSVP and show your QR pass at the gate.</p>
                      <span>eventhub.lk/i/PS-0412</span>
                    </div>
                    <p>Each guest gets their own link and QR pass.</p>
                  </div>
                </aside>
              </div>
            </section>
          ) : activeSection === "Guests" ? (
            <section className="guests-page">
              <header className="guests-header">
                <div>
                  <h1>Guests</h1>
                  <p>Guests answer from a WhatsApp link in the browser. No app needed.</p>
                </div>
                <div className="guests-header-actions">
                  <label className="guest-action-button" htmlFor="guest-csv-input">Import CSV</label>
                  <input
                    id="guest-csv-input"
                    className="guest-csv-input"
                    type="file"
                    accept=".csv,text/csv"
                    onChange={importGuestCsv}
                  />
                  <button type="button" className="guest-action-button" onClick={() => { setGuestNotice(""); setShowGuestForm(true); }}>+ Add guest</button>
                  <button type="button" className="send-whatsapp-button" onClick={() => { setInvitationNotice(""); setInvitationAudience("not-invited"); setActiveSection("Invitations"); }}>Send WhatsApp invitations</button>
                </div>
              </header>

              {guestNotice && <p className="guest-notice" role="status">{guestNotice}</p>}

              <section className="guest-stat-grid" aria-label="Guest response summary">
                <article><span>Total guests</span><strong>{guestCounts.total}</strong></article>
                <article><span>Invited</span><strong>{guestCounts.invited}</strong></article>
                <article><span>Yes</span><strong>{guestCounts.yes}</strong></article>
                <article><span>No</span><strong>{guestCounts.no}</strong></article>
                <article><span>No reply</span><strong>{guestCounts.noReply}</strong></article>
                <article><span>Not yet invited</span><strong>{guestCounts.notSent}</strong></article>
              </section>

              <div className="guests-main-grid">
                <section className="guest-list-card" aria-label="Guest list">
                  <div className="guest-list-toolbar">
                    <label className="guest-search">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" /><path d="m15.5 15.5 4.2 4.2" /></svg>
                      <input
                        type="search"
                        aria-label="Search guests"
                        placeholder="Search guests"
                        value={guestSearch}
                        onChange={(event) => setGuestSearch(event.target.value)}
                      />
                    </label>
                    <select aria-label="Filter by answer" value={guestAnswerFilter} onChange={(event) => setGuestAnswerFilter(event.target.value)}>
                      <option>All answers</option>
                      <option>Yes</option>
                      <option>No</option>
                      <option>No reply</option>
                      <option>Not sent</option>
                    </select>
                  </div>
                  <div className="guest-table-wrap">
                    <div className="guest-table-head">
                      <span>Guest</span><span>WhatsApp</span><span>Invite sent</span><span>Answer</span><span>Entry pass</span>
                    </div>
                    {visibleGuests.length ? visibleGuests.map((guest) => (
                      <div className="guest-table-row" key={guest.id}>
                        <strong>{guest.name}</strong>
                        <span>{guest.phone}</span>
                        <span>{guest.inviteSent}</span>
                        <span><b className={`guest-answer-badge ${guest.answer.toLowerCase().replace(" ", "-")}`}>{guest.answer === "Not sent" ? "—" : guest.answer}</b></span>
                        <span className="guest-pass">
                          {guest.answer === "Yes" ? (
                            <>
                              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 1h5v5H1zM10 1h5v5h-5zM1 10h5v5H1zM10 10h2v2h-2zM13 13h2v2h-2zM13 9h2v2h-2z" /></svg>
                              QR issued
                            </>
                          ) : guest.answer === "No reply" ? <button type="button" onClick={() => setGuestNotice(`Invitation reminder queued for ${guest.name}.`)}>Resend</button> : <span className="guest-no-pass">—</span>}
                        </span>
                      </div>
                    )) : <p className="guest-empty">No guests match your search.</p>}
                  </div>
                </section>

                <aside className="whatsapp-card">
                  <h2>WhatsApp message</h2>
                  <div className="whatsapp-preview">
                    <div className="whatsapp-message">
                      {editingGuestMessage ? (
                        <textarea aria-label="Edit WhatsApp message" value={guestMessage} onChange={(event) => setGuestMessage(event.target.value)} />
                      ) : (
                        <p>{guestMessage}</p>
                      )}
                    </div>
                  </div>
                  <p className="whatsapp-caption">One click Yes or No. A Yes issues a QR entry pass that gate staff scan once.</p>
                  <button type="button" className="edit-message-button" onClick={() => setEditingGuestMessage((editing) => !editing)}>
                    {editingGuestMessage ? "Save message" : "Edit message"}
                  </button>
                </aside>
              </div>

              {showGuestForm && (
                <div className="guest-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowGuestForm(false); }}>
                  <form className="guest-modal" onSubmit={addGuest} aria-labelledby="guest-modal-title">
                    <button className="guest-modal-close" type="button" aria-label="Close" onClick={() => setShowGuestForm(false)}>×</button>
                    <h2 id="guest-modal-title">Add a guest</h2>
                    <label>
                      Guest name
                      <input autoFocus required value={newGuestName} onChange={(event) => setNewGuestName(event.target.value)} placeholder="e.g. Maya Perera" />
                    </label>
                    <label>
                      WhatsApp number
                      <input required value={newGuestPhone} onChange={(event) => setNewGuestPhone(event.target.value)} placeholder="+94 77 123 4567" />
                    </label>
                    <button type="submit" className="send-whatsapp-button">Add guest</button>
                  </form>
                </div>
              )}
            </section>
          ) : activeSection === "Timeline" ? (
            <>
              <header className="timeline-page-header">
                <div>
                  <h1>Timeline</h1>
                  <p>Perera–Silva wedding · Sat 12 Dec</p>
                </div>
                <button type="button" className="add-task-button" onClick={() => setShowTimelineTaskForm((visible) => !visible)}>
                  {showTimelineTaskForm ? "Cancel" : "+ Add task"}
                </button>
              </header>

              {showTimelineTaskForm && (
                <form className="timeline-add-task-form" onSubmit={addTimelineTask}>
                  <label>
                    <span>Time</span>
                    <input className="text-input" type="time" value={newTimelineTaskTime} onChange={(event) => setNewTimelineTaskTime(event.target.value)} required />
                  </label>
                  <label>
                    <span>Task</span>
                    <input className="text-input" type="text" value={newTimelineTaskName} onChange={(event) => setNewTimelineTaskName(event.target.value)} placeholder="Enter task details" required />
                  </label>
                  <label>
                    <span>Who</span>
                    <input className="text-input" type="text" value={newTimelineTaskOwner} onChange={(event) => setNewTimelineTaskOwner(event.target.value)} placeholder="Person or vendor" required />
                  </label>
                  <button type="submit" className="primary-button timeline-save-task-button">Add to timeline</button>
                </form>
              )}

              <div className="timeline-progress">
                <span>{dashboardCompletedTaskCount} of {dashboardTotalTaskCount} done</span>
                <div><i style={{ width: `${(dashboardCompletedTaskCount / dashboardTotalTaskCount) * 100}%` }} /></div>
              </div>

              <section className="timeline-table" aria-label="Event timeline">
                <header className="timeline-table-head">
                  <span>TIME</span>
                  <span>TASK</span>
                  <span>WHO</span>
                  <span>STATUS</span>
                </header>
                {timelineTasks.map((task) => (
                  <article className="timeline-row" key={task.id}>
                    <button
                      type="button"
                      className={`task-checkbox ${task.statusType === "done" ? "checked" : ""}`}
                      aria-label={task.statusType === "done" ? `${task.task} completed` : `Mark ${task.task} as completed`}
                      disabled={task.statusType === "done"}
                      onClick={() => setTaskToComplete(task)}
                      style={task.statusType === "done" ? {
                        backgroundColor: "var(--color-success)",
                        borderColor: "var(--color-success)",
                        boxShadow: "none",
                        color: "#fff",
                      } : undefined}
                    >
                      {task.statusType === "done" && <span aria-hidden="true">✓</span>}
                    </button>
                    <strong>{formatTimelineTime(task.time)}</strong>
                    <span className="timeline-task-name">{task.task}</span>
                    <span>{task.who}</span>
                    <b className={`timeline-status ${task.statusType}`}>{task.status}</b>
                  </article>
                ))}
              </section>

              {taskToComplete && (
                <div className="completion-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setTaskToComplete(null); }}>
                  <section className="completion-modal task-completion-modal" role="dialog" aria-modal="true" aria-labelledby="task-completion-modal-title">
                    <h2 id="task-completion-modal-title">Mark this task as completed?</h2>
                    <p className="completion-modal-description">Confirm this task is finished. This will update the event timeline and dashboard.</p>
                    <div className="task-completion-details">
                      <strong>TASK DETAILS</strong>
                      <p><span>Task</span><b>{taskToComplete.task}</b></p>
                      <p><span>Assigned to</span><b>{taskToComplete.who}</b></p>
                      <p><span>Scheduled time</span><b>{formatTimelineTime(taskToComplete.time)}</b></p>
                    </div>
                    <div className="completion-modal-actions">
                      <button type="button" className="completion-cancel-button" onClick={() => setTaskToComplete(null)}>Cancel</button>
                      <button type="button" className="completion-confirm-button" onClick={completeTimelineTask}>Mark completed</button>
                    </div>
                  </section>
                </div>
              )}
            </>
          ) : (
          <>
          <header className="dashboard-header">
            <div>
              <h1>Hello, Dilini</h1>
              <p>Saturday 12 December 2026 · you are on duty for 1 event</p>
            </div>
            <button type="button" className="timeline-button" onClick={() => setActiveSection("Timeline")}>Open timeline</button>
          </header>

          <section className="event-summary">
            <div className="summary-copy">
              <p>TODAY · ASSIGNED BY SHEHAN G.</p>
              <h2>Perera–Silva wedding</h2>
              <span>Waters Edge, Grand Ballroom · guests from 6.30 pm · {guestCounts.total} guests</span>
            </div>
            <span className={`live-badge${eventCompleted ? " completed" : ""}`}>{eventCompleted ? "Completed" : "Live"}</span>
            <div className="checklist">
              <span>Checklist {dashboardCompletedTaskCount} of {dashboardTotalTaskCount} done</span>
              <div><i style={{ width: `${(dashboardCompletedTaskCount / dashboardTotalTaskCount) * 100}%` }} /></div>
            </div>
          </section>

          {completionNotice && <p className="completion-dashboard-notice" role="status">{completionNotice}</p>}

          <section className="metric-grid" aria-label="Event metrics">
            <article>
              <p>Vendors arrived</p>
              <strong>{arrivedVendorCount} of {vendorStatuses.length}</strong>
              <span>{lateVendorCount} late</span>
            </article>
            <article>
              <p>Guests confirmed</p>
              <strong>{confirmedGuestCount}</strong>
              <span>of {invitedGuestCount} invited</span>
            </article>
            <article>
              <p>Open incidents</p>
              <strong>{openIncidentCount}</strong>
              <span>{openIncidentCount === 1 ? "raised by you" : "currently open"}</span>
            </article>
            <article>
              <p>Next task</p>
              <strong>{dashboardPendingTask ? formatTimelineTime(dashboardPendingTask.time) : "—"}</strong>
              <span>{dashboardPendingTask?.task ?? "All tasks completed"}</span>
            </article>
          </section>

          <div className="dashboard-bottom-grid">
            <section className="up-next-card">
              <header>
                <h2>Up next</h2>
                <button type="button" onClick={() => setActiveSection("Timeline")}>Full timeline</button>
              </header>
              <div className="timeline-list">
                {dashboardUpNextTasks.map((task) => (
                  <article key={task.id}>
                    <div><strong>{formatTimelineTime(task.time)} · {task.task}</strong><span>{task.who}</span></div>
                    <b className={task.statusType}>{task.status}</b>
                  </article>
                ))}
              </div>
            </section>

            <section className="quick-actions">
              <h2>Quick actions</h2>
              <button type="button" onClick={() => setActiveSection("Invitations")}>Send invitation</button>
              <button type="button" onClick={() => setActiveSection("Incidents")}>Raise incident</button>
              <button type="button" onClick={() => setActiveSection("War Room")}>Open War Room (view only)</button>
              <button
                type="button"
                className="complete-button"
                onClick={() => { setCompletionNotice(""); setActiveSection("Completion"); setShowCompletionConfirm(true); }}
                disabled={eventCompleted}
              >
                {eventCompleted ? "Event completed" : "Mark event completed"}
              </button>
            </section>
          </div>
          </>
          )}
        </section>
      </main>
    );
  }

  if (showLanding) {
    return <LandingPage onAuth={openAuth} />;
  }

  return (
    <main className={`auth-page${step === "forgot" || step === "reset" || step === "google" ? " auth-page-recovery" : ""}`}>
      <AuthHeader onHome={goHome}>
        {mode === "login" || step !== "form" ? (
          <div className="auth-topbar-prompt">
            <span>New to EventHub?</span>
            <button type="button" onClick={() => switchMode("signup")}>Create an account</button>
          </div>
        ) : (
          <Link className="back-home-link" href="/" onClick={goHome}>← Back to home</Link>
        )}
      </AuthHeader>

      <section className={`auth-shell${step === "forgot" || step === "reset" || step === "google" ? " auth-shell-recovery" : ""}`} aria-label="EventHub account access">
        <aside className={`intro-panel intro-panel-${step === "verify" ? "verify" : mode === "login" || step !== "form" ? "login" : role === "Vendor" ? "vendor" : "client"}`}>
          <div className="intro-orb intro-orb-one" />
          <div className="intro-orb intro-orb-two" />
          <div className="intro-content">
            <span className="intro-kicker"><span className="kicker-dot" /> EVENTHUB · MADE FOR GATHERINGS</span>
            <h1>
              {step === "verify" ? <>One last<br /><em>step.</em></> : step === "forgot" ? <>A fresh start<br /><em>is one step away.</em></> : step === "reset" ? <>Choose a new<br /><em>password.</em></> : step === "google" ? <>Gather well.<br /><em>We’ll get you there.</em></> : mode === "login" ? <>Welcome<br /><em>back.</em></> : role === "Vendor" ? <>Get booked for<br /><em>the dates you are free.</em></> : <>Your event,<br /><em>planned with care.</em></>}
            </h1>
            <p className="intro-copy">
              {step === "verify" ? "Enter the 6-digit code sent to your email to finish setting up your account." : step === "forgot" || step === "reset" ? "Set a new password for an account saved in this browser." : step === "google" ? "Google sign-in is unavailable. Use your email and password instead." : mode === "login" ? "Sign in to an account saved in this browser." : getRoleMessage(role)}
            </p>
            <div className="intro-rule" />
            <p className="intro-caption">A place for every part of the celebration.</p>
          </div>
          <div className="intro-footer">
            <span className="footer-spark" aria-hidden="true">✳</span>
            <span>From first idea to final guest.</span>
          </div>
        </aside>

        <section className="form-panel">
          <div className="form-content">
            {step === "google" ? (
              <GoogleStatus actions={{ goHome: flow.goHome, returnToLogin: flow.returnToLogin }} />
            ) : step === "forgot" ? (
              <ForgotPasswordForm {...flow.forgotPasswordForm} />
            ) : step === "reset" ? (
              <ResetPasswordForm {...flow.resetPasswordForm} />
            ) : step === "verify" ? (
              <VerifyEmailForm {...flow.verifyEmailForm} />
            ) : (
              <AccountForm {...flow.accountForm} vendorFields={<VendorFields {...flow.vendorFields} />} />
            )}
          </div>
        </section>
      </section>
      <footer className="page-footer">
        <span>© 2026 EventHub</span>
        <span>Made for moments that matter</span>
      </footer>
    </main>
  );
}
