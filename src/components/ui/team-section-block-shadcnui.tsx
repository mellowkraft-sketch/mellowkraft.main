import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  MapPin,
  Sparkles,
} from 'lucide-react'

type TeamMember = {
  name: string
  role: string
  bio: string
  image?: string
  fallbackImage?: string
  imagePosition?: string
  location: string
  skills: string[]
  gradient: string
  avatarEmoji?: string
  vision?: string
}

const teamMembers: TeamMember[] = [
  {
    name: 'Apoorv Sandilya',
    role: 'Founder & CEO',
    bio: 'Builds MellowKraft around long-term commerce architecture, decisive execution, and ownership-led growth systems.',
    image: '/images/0991f818-826f-45e7-a204-024aef879ee6~1.jpg',
    fallbackImage:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    imagePosition: 'center',
    location: 'Lucknow, India',
    skills: ['Architecture', 'Strategy', 'Automation'],
    gradient: 'from-primary/25 via-primary/10 to-transparent',
    vision: 'Build sovereign commerce systems brands truly own.',
  },
  {
    name: 'Ritesh Nandan',
    role: 'Co-Founder & CTO',
    bio: 'Leads engineering direction across platform reliability, integration depth, and scalable full-stack execution.',
    image: '/images/1774045177533~2.png',
    fallbackImage:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    imagePosition: 'center',
    location: 'Lucknow, India',
    skills: ['Full Stack', 'Automation', 'Systems'],
    gradient: 'from-emerald-300/20 via-primary/10 to-transparent',
    vision: 'Engineer scale that compounds clarity, speed, and margin.',
  },
]

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="group relative">
      <Card className="relative overflow-visible rounded-3xl border border-black/10 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${member.gradient} opacity-0 transition-opacity duration-300 sm:group-hover:opacity-100`} />

        <div className="absolute right-4 top-4 z-10 hidden sm:block">
          <Sparkles className="h-5 w-5 text-[var(--forest)] opacity-70" aria-hidden />
        </div>

        <div className="relative z-10 p-6">
          <div className="mb-4 flex justify-center">
            <div className="relative mx-auto w-fit">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border border-black/10 bg-[var(--surface-soft)] p-1">
                {member.avatarEmoji ? (
                  <div
                    className="flex h-full w-full items-center justify-center rounded-full bg-white text-5xl"
                    aria-label={`${member.name} avatar emoji`}
                  >
                    <span role="img" aria-hidden>{member.avatarEmoji}</span>
                  </div>
                ) : (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full rounded-full object-cover"
                    style={{ objectPosition: member.imagePosition || 'center' }}
                    onError={(event) => {
                      if (member.fallbackImage && event.currentTarget.src !== member.fallbackImage) {
                        event.currentTarget.src = member.fallbackImage
                      }
                    }}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="auto"
                  />
                )}
              </div>

              {member.vision && (
                <div
                  className="mt-3 rounded-2xl border border-[var(--mars)]/55 bg-white px-4 py-3 text-left shadow-[0_8px_24px_rgba(0,0,0,0.12)] lg:pointer-events-none lg:absolute lg:left-[calc(100%+0.6rem)] lg:top-1/2 lg:mt-0 lg:w-[294px] lg:-translate-y-1/2 lg:opacity-0 lg:transition-opacity lg:duration-200 lg:group-hover:opacity-100"
                  aria-label="Founder vision"
                >
                  <span className="block text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--forest)]">
                    Founder Vision
                  </span>
                  <p className="mt-1.5 text-[1.05rem] font-medium leading-snug text-[var(--text)]">{member.vision}</p>
                  <span
                    aria-hidden
                    className="hidden lg:block absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b border-l border-[var(--mars)]/55 bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <h3 className="mb-1 text-xl font-bold tracking-tight text-[var(--text)]">
              {member.name}
            </h3>
            <Badge
              variant="secondary"
              className="mb-2 border border-[var(--mars)]/35 bg-transparent text-xs uppercase tracking-[0.22em] text-[var(--forest)]"
            >
              {member.role}
            </Badge>

            <div className="mb-3 flex items-center justify-center gap-1 text-xs text-[var(--muted)]">
              <MapPin className="h-3 w-3" aria-hidden />
              <span>{member.location}</span>
            </div>

            <p className="mb-4 text-sm text-[#3a3a3a]">{member.bio}</p>

            <div className="mb-4 flex flex-wrap justify-center gap-1.5">
              {member.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="border-black/15 bg-white text-xs text-[#3a3a3a]"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function TeamSectionBlock() {
  return (
    <section
      aria-labelledby="team-section-heading"
      className="relative w-full overflow-visible py-12"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="hidden md:block absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[var(--mars)] opacity-20 blur-[180px]" />
        <div className="hidden md:block absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[var(--forest)] opacity-20 blur-[180px]" />
      </div>

      <div className="mx-auto w-[95%] sm:w-[90%] md:w-[78%] lg:w-[63%]">
        <div className="mb-10 text-center sm:mb-12 md:mb-16">
          <div className="mb-6 inline-block">
            <Badge
              className="gap-2 border border-black/10 bg-white text-[var(--forest)]"
              variant="secondary"
            >
              <Sparkles className="h-3 w-3" aria-hidden />
              Our Core Team
            </Badge>
          </div>

          <h2
            id="team-section-heading"
            className="mb-4 text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl md:mb-6 md:text-6xl"
          >
            Meet the people behind
            <br />
            <span className="text-[var(--forest)]">
              MellowKraft
            </span>
          </h2>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>

        <div className="mt-10 text-center sm:mt-12 md:mt-16">
          <Card className="inline-flex w-full max-w-xl flex-col items-center gap-5 rounded-3xl border-[1.5px] border-[var(--mars)] bg-white px-5 py-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:px-8 md:px-10 md:py-8">
            <h3 className="text-2xl font-bold text-[var(--mars)]">Join Our Team</h3>
            <p className="max-w-xl text-sm text-[var(--mars)]">
              We are always looking for high-agency builders and system thinkers.
            </p>
            <Button
              size="lg"
              asChild
              className="group relative w-full overflow-hidden rounded-full border-[1.5px] border-[var(--mars)] bg-transparent px-8 py-5 text-[var(--mars)] shadow-none transition-colors duration-300 hover:bg-[var(--mars)] hover:text-white sm:w-auto sm:px-10 sm:py-6"
            >
              <a href="mailto:mellowkraft@protonmail.com?subject=Join%20Our%20Team%20-%20Application">
                <span className="relative font-medium">View Open Positions</span>
                <span className="relative ml-2">
                  →
                </span>
              </a>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  )
}
