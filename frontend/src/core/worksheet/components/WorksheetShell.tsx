import { useState, type ReactNode } from "react";

import {
  ArrowLeft,
  Menu,
  Hash,
  FlaskConical,
  Save,
} from "lucide-react";

interface WorksheetShellProps {
  worksheetId: string;
  status: string;
  role: string;
  registrationNo: string;
  sampleName: string;

  onBack?: () => void;
  onSaveDraft?: () => void;

  children: ReactNode;
}

function getStatusLabel(status: string): string {
  if (!status) {
    return "DRAFT";
  }

  return status.toUpperCase();
}

function getRoleLabel(role: string): string {
  if (!role) {
    return "";
  }

  return role.toUpperCase();
}

export default function WorksheetShell({
  worksheetId,
  status,
  role,
  registrationNo,
  sampleName,
  onBack,
  onSaveDraft,
  children,
}: WorksheetShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className="
        h-screen
        w-full
        overflow-hidden
        bg-[#10182d]
      "
    >
      <div
        className="
          flex
          h-full
          w-full
          overflow-hidden
        "
      >
        {/* =====================================================
            LEFT SIDEBAR
           ===================================================== */}

        {sidebarOpen && (
          <aside
            className="
              relative
              flex
              h-screen
              w-[284px]
              shrink-0
              flex-col
              overflow-hidden
              bg-[#f8fafb]
            "
          >
            {/* =================================================
                GREEN HEADER
               ================================================= */}

            <div
              className="
                relative
                h-[212px]
                shrink-0
                overflow-hidden
                bg-gradient-to-br
                from-[#008c68]
                via-[#00745a]
                to-[#003d3b]
              "
            >
              {/* V1-style dotted texture */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  opacity-[0.12]
                "
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.65) 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              />

              {/* Right-side darker gradient */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  right-0
                  w-[110px]
                  bg-gradient-to-l
                  from-[#003438]/55
                  to-transparent
                "
              />

              <div className="relative z-10 h-full">
                {/* =================================================
                    BACK + MENU
                   ================================================= */}

                <div
                  className="
                    px-[16px]
                    pt-[14px]
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    {/* BACK */}

                    <button
                      type="button"
                      onClick={onBack}
                      className="
                        flex
                        items-center
                        gap-[7px]
                        border-0
                        bg-transparent
                        p-0
                        text-[12px]
                        font-semibold
                        uppercase
                        tracking-[0.02em]
                        text-emerald-100/80
                        transition
                        hover:text-white
                      "
                    >
                      <ArrowLeft
                        size={15}
                        strokeWidth={2}
                      />

                      <span>Back</span>
                    </button>

                    {/* MENU */}

                    <button
                      type="button"
                      aria-label="Collapse worksheet sidebar"
                      onClick={() => setSidebarOpen(false)}
                      className="
                        flex
                        h-[35px]
                        w-[35px]
                        items-center
                        justify-center
                        rounded-[9px]
                        border
                        border-white/20
                        bg-white/[0.10]
                        text-white/90
                        shadow-sm
                        transition
                        hover:bg-white/[0.18]
                      "
                    >
                      <Menu
                        size={19}
                        strokeWidth={2}
                      />
                    </button>
                  </div>

                  {/* =================================================
                      HORIZONTAL BAR BELOW BACK
                     ================================================= */}

                  <div
                    className="
                      mt-[14px]
                      h-px
                      w-full
                      bg-white/[0.10]
                    "
                  />
                </div>

                {/* =================================================
                    WORKSHEET IDENTITY
                   ================================================= */}

                <div
                  className="
                    px-[16px]
                    pt-[25px]
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-[7px]
                    "
                  >
                    <span
                      className="
                        h-[15px]
                        w-[4px]
                        rounded-sm
                        bg-emerald-300
                      "
                    />

                    <span
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.22em]
                        text-emerald-200
                      "
                    >
                      Worksheet
                    </span>
                  </div>

                  {/* WORKSHEET ID */}

                  <div
                    className="
                      mt-[9px]
                      text-[18px]
                      font-extrabold
                      leading-none
                      tracking-[0.01em]
                      text-white
                    "
                  >
                    {worksheetId}
                  </div>

                  {/* =================================================
                      STATUS + ROLE
                     ================================================= */}

                  <div
                    className="
                      mt-[11px]
                      flex
                      flex-wrap
                      items-center
                      gap-[8px]
                    "
                  >
                    {/* STATUS */}

                    <span
                      className="
                        inline-flex
                        h-[24px]
                        items-center
                        gap-[6px]
                        rounded-full
                        bg-white
                        px-[11px]
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.04em]
                        text-slate-700
                      "
                    >
                      <span
                        className="
                          h-[6px]
                          w-[6px]
                          rounded-full
                          bg-emerald-500
                        "
                      />

                      {getStatusLabel(status)}
                    </span>

                    {/* ROLE */}

                    {role && (
                      <span
                        className="
                          inline-flex
                          h-[24px]
                          items-center
                          gap-[6px]
                          rounded-full
                          bg-white
                          px-[11px]
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.04em]
                          text-orange-600
                        "
                      >
                        <span
                          className="
                            h-[6px]
                            w-[6px]
                            rounded-full
                            bg-orange-400
                          "
                        />

                        {getRoleLabel(role)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                WHITE / LIGHT LOWER SECTION
               ================================================= */}

            <div
              className="
                relative
                flex
                min-h-0
                flex-1
                flex-col
                overflow-hidden
                bg-[#f8fafb]
              "
            >
              {/* =================================================
                  SIDEBAR CONTENT
                 ================================================= */}

              <div
                className="
                  min-h-0
                  flex-1
                  overflow-hidden
                "
              >
                {/* =================================================
                    REGISTRATION + SAMPLE
                   ================================================= */}

                <div
                  className="
                    space-y-[9px]
                    px-[11px]
                    pt-[17px]
                  "
                >
                  {/* =================================================
                      REGISTRATION NUMBER
                     ================================================= */}

                  <div
                    className="
                      h-[59px]
                      rounded-[12px]
                      border
                      border-slate-200
                      bg-white
                      px-[12px]
                      shadow-[0_2px_4px_rgba(15,23,42,0.10)]
                    "
                  >
                    <div
                      className="
                        flex
                        h-full
                        items-center
                        gap-[11px]
                      "
                    >
                      {/* ICON */}

                      <div
                        className="
                          flex
                          h-[31px]
                          w-[31px]
                          shrink-0
                          items-center
                          justify-center
                          rounded-[8px]
                          border
                          border-emerald-100
                          bg-emerald-50
                          text-emerald-500
                        "
                      >
                        <Hash
                          size={15}
                          strokeWidth={1.8}
                        />
                      </div>

                      <div className="min-w-0">
                        <div
                          className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.18em]
                            text-slate-400
                          "
                        >
                          Reg No
                        </div>

                        <div
                          className="
                            mt-[2px]
                            truncate
                            text-[12px]
                            font-medium
                            leading-none
                            text-slate-700
                          "
                        >
                          {registrationNo || "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      SAMPLE
                     ================================================= */}

                  <div
                    className="
                      h-[59px]
                      rounded-[12px]
                      border
                      border-slate-200
                      bg-white
                      px-[12px]
                      shadow-[0_2px_4px_rgba(15,23,42,0.10)]
                    "
                  >
                    <div
                      className="
                        flex
                        h-full
                        items-center
                        gap-[11px]
                      "
                    >
                      {/* ICON */}

                      <div
                        className="
                          flex
                          h-[31px]
                          w-[31px]
                          shrink-0
                          items-center
                          justify-center
                          rounded-[8px]
                          border
                          border-emerald-100
                          bg-emerald-50
                          text-emerald-500
                        "
                      >
                        <FlaskConical
                          size={15}
                          strokeWidth={1.8}
                        />
                      </div>

                      <div className="min-w-0">
                        <div
                          className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.18em]
                            text-slate-400
                          "
                        >
                          Sample
                        </div>

                        <div
                          className="
                            mt-[2px]
                            truncate
                            text-[12px]
                            font-semibold
                            leading-none
                            text-slate-700
                          "
                        >
                          {sampleName || "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    ACTIONS
                   ================================================= */}

                <div
                  className="
                    mt-[25px]
                    px-[16px]
                  "
                >
                  {/* Divider */}

                  <div
                    className="
                      flex
                      items-center
                      gap-[11px]
                    "
                  >
                    <div
                      className="
                        h-px
                        flex-1
                        bg-slate-200
                      "
                    />

                    <span
                      className="
                        shrink-0
                        bg-[#f8fafb]
                        px-[2px]
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.19em]
                        text-slate-400
                      "
                    >
                      Actions
                    </span>

                    <div
                      className="
                        h-px
                        flex-1
                        bg-slate-200
                      "
                    />
                  </div>

                  {/* SAVE DRAFT */}

                  <button
                    type="button"
                    onClick={onSaveDraft}
                    className="
                      mt-[10px]
                      flex
                      h-[43px]
                      w-full
                      items-center
                      justify-start
                      gap-[9px]
                      rounded-[11px]
                      border-0
                      bg-[#00b77f]
                      px-[18px]
                      text-[13px]
                      font-semibold
                      text-white
                      shadow-[0_3px_6px_rgba(0,183,127,0.25)]
                      transition
                      hover:bg-[#00aa77]
                      active:scale-[0.99]
                    "
                  >
                    <Save
                      size={15}
                      strokeWidth={2}
                    />

                    <span>Save Draft</span>
                  </button>
                </div>
              </div>

              {/* =================================================
                  FOOTER
                 ================================================= */}

              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  z-20
                  h-[58px]
                  border-t
                  border-slate-200
                  bg-white
                  px-[20px]
                "
              >
                <div
                  className="
                    flex
                    h-full
                    items-center
                    justify-between
                  "
                >
                  {/* =================================================
                      EFRAC LOGO
                     ================================================= */}

                  <div
                    className="
                      flex
                      flex-col
                      justify-center
                    "
                  >
                    <div
                      className="
                        text-[19px]
                        font-medium
                        leading-[18px]
                        tracking-[0.08em]
                        text-[#79c4ad]
                      "
                    >
                      EFRAC
                    </div>

                    <div
                      className="
                        mt-[1px]
                        text-[6px]
                        font-medium
                        uppercase
                        leading-[7px]
                        tracking-[0.12em]
                        text-[#a5adb7]
                      "
                    >
                      A{" "}
                      <span className="text-[#ef5260]">
                        QIMA
                      </span>{" "}
                      COMPANY
                    </div>
                  </div>

                  {/* =================================================
                      SYSTEM ACTIVE
                     ================================================= */}

                  <div
                    className="
                      flex
                      items-center
                      gap-[6px]
                      text-[8px]
                      font-medium
                      uppercase
                      leading-none
                      tracking-[0.15em]
                      text-[#53678a]
                    "
                  >
                    <span
                      className="
                        h-[6px]
                        w-[6px]
                        rounded-full
                        bg-[#58d9b5]
                      "
                    />

                    <span>
                      System Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* =====================================================
            MAIN WORKSHEET AREA

            ONLY THIS AREA SCROLLS
           ===================================================== */}

        <main
          className="
            relative
            h-screen
            min-w-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            bg-[#10182d]
          "
        >
          {/* ==================================================
              COLLAPSED SIDEBAR BUTTON
             ================================================== */}

          {!sidebarOpen && (
            <button
              type="button"
              aria-label="Open worksheet sidebar"
              onClick={() => setSidebarOpen(true)}
              className="
                fixed
                left-[8px]
                top-[8px]
                z-50
                flex
                h-[35px]
                w-[35px]
                items-center
                justify-center
                rounded-[9px]
                border
                border-white/10
                bg-[#101a31]
                text-white
                shadow-lg
              "
            >
              <Menu
                size={19}
                strokeWidth={2}
              />
            </button>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}