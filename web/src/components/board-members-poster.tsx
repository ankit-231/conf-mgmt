import Image from "next/image"

import { STATIC_BASE_URL } from "@/config/api-endpoints"

type Member = {
  role: string
  name: string
  photo: string
}

// Member photos are served by Django's static files (not committed to this
// repo) at STATIC_BASE_URL/board-poster/*.png.
const boardPosterAsset = (fileName: string) =>
  `${STATIC_BASE_URL}/board-poster/${fileName}`

const president: Member = {
  role: "President",
  name: "Rtr. Pankaj Chaudhary",
  photo: boardPosterAsset("pankaj.png"),
}

const members: Member[] = [
  { role: "IPP", name: "Rtr. Bindu Neupane", photo: boardPosterAsset("bindu.png") },
  { role: "Vice President", name: "Rtr. Asmita Chapagain", photo: boardPosterAsset("asmita.png") },
  { role: "Secretary", name: "Rtr. Kristina Bastola", photo: boardPosterAsset("kristina.png") },
  { role: "Treasurer", name: "Rtr. Santoshi Kharel", photo: boardPosterAsset("santoshi.png") },
  { role: "Club Advisor", name: "Rtr. Sushmita Ghimire", photo: boardPosterAsset("sushmita.png") },
  { role: "Club Advisor", name: "Rtr. Utsav Bikram Thapa", photo: boardPosterAsset("utsav.png") },
  { role: "Club Advisor", name: "Rtr. Sabina Khanal", photo: boardPosterAsset("sabina.png") },
  { role: "Learning Facilitator", name: "Rtr. Sayujya Satyal", photo: boardPosterAsset("sayujya.png") },
  { role: "Young Leader Contact", name: "Rtr. Ankit Khanal", photo: boardPosterAsset("ankit.png") },
  { role: "International Service Director", name: "Rtr. Rubina Timsina", photo: boardPosterAsset("rubina.png") },
  { role: "Public Image Chair", name: "Rtr. Samriddhi Khadka", photo: boardPosterAsset("samriddhi.png") },
]

function BoardMembersPoster() {
  return (
    <div
      className="mx-auto w-full max-w-[800px] px-4 pt-5 pb-7 font-sans sm:px-6 sm:pt-7 sm:pb-9"
      style={{ background: "linear-gradient(180deg, #f2e6e8 0%, #eee0e3 100%)" }}
    >
      <div className="rounded-md bg-white px-4 pt-4 pb-6 shadow-[0_2px_20px_rgba(90,20,40,0.08)] sm:px-[26px] sm:pt-[22px] sm:pb-8">
        <div className="mb-3 text-center sm:mb-[18px]">
          <div className="text-lg font-extrabold tracking-[1px] text-brand-maroon sm:text-[26px] sm:tracking-[1.5px]">
            ROTARACT CLUB OF KATHMANDU METROPOLIS
          </div>
        </div>

        <Image
          src={boardPosterAsset("header_logos.png")}
          alt="Rotaract and partner logos"
          width={800}
          height={100}
          className="mb-4 block h-auto w-full object-contain sm:mb-[22px]"
        />

        <div className="mb-5 text-center sm:mb-8">
          <span className="inline-block rounded-[22px] bg-brand-maroon px-4 py-2 text-xs font-extrabold tracking-[0.5px] text-white sm:px-[26px] sm:py-[9px] sm:text-[16px] sm:tracking-[0.8px]">
            ROTA YEAR 2026/2027 BOARD MEMBERS
          </span>
        </div>

        <div className="mb-6 flex flex-col items-center sm:mb-[34px]">
          <div className="mb-2 size-24 overflow-hidden rounded-full border-2 border-brand-maroon sm:mb-2.5 sm:size-[150px] sm:border-[3px]">
            <Image
              src={president.photo}
              alt={president.name}
              width={150}
              height={150}
              className="size-full object-cover object-[center_top]"
            />
          </div>
          <div className="text-sm font-extrabold tracking-[0.2px] text-brand-maroon sm:text-[15px] sm:tracking-[0.3px]">
            {president.role}
          </div>
          <div className="text-sm text-[#2a2a2a] sm:text-[15px]">{president.name}</div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 sm:gap-x-9 sm:gap-y-[26px]">
          {members.map((member) => (
            <div key={member.name} className="flex w-24 flex-col items-center sm:w-[130px]">
              <div className="mb-1.5 size-16 overflow-hidden rounded-full sm:mb-[9px] sm:size-[88px]">
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={88}
                  height={88}
                  className="size-full object-cover object-[center_top]"
                />
              </div>
              <div className="text-center text-[11px] leading-[1.3] font-extrabold text-brand-maroon sm:text-[13px]">
                {member.role}
              </div>
              <div className="text-center text-[11px] text-[#2a2a2a] sm:text-[13px]">{member.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { BoardMembersPoster }
