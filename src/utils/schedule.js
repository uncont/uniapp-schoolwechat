// 课表工具函数：将原始课程列表转换为课表页面可用的数据结构
// 定义学期开始日期
export const SEMESTER_START_DATE = '2025-09-01'

/**
 * 获取今日信息
 * @param {Object} options 配置选项
 * @param {'year'|'date'|'weekday'|'yearDate'|'dateWeekday'|'yearDateWeekday'} [options.format='yearDate'] - 返回格式类型
 * @returns {string} 根据格式返回的日期信息
 */
export function getTodayInfo(options = {}) {
  const { format = 'yearDate' } = options
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  // 中文周几映射
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[now.getDay()]

  switch (format) {
    case 'year':
      return String(year)
    case 'date': // 月-日格式
      return `${month}-${day}`
    case 'weekday': // 周几
      return weekday
    case 'yearDate': // 年-月-日
      return `${year}-${month}-${day}`
    case 'dateWeekday': // 月-日 周几
      return `${month}-${day} ${weekday}`
    case 'yearDateWeekday': // 年-月-日 周几
      return `${year} ${month}月${day}日 ${weekday}`
    default:
      return `${year}-${month}-${day}` // 默认返回年-月-日
  }
}

/**
 * 计算当前是第几教学周
 * @returns {number} 当前教学周数，0表示还未开学或已放假
 */
export function getCurrentWeekNumber() {
  const start = new Date(SEMESTER_START_DATE)
  const today = new Date()

  // 确保今天在学期开始之后
  if (today < start) return 0

  // 计算相差的天数
  const diffTime = today - start

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.floor(diffDays / 7) + 1
}

/**
 * 构建周几的元数据
 * @param {Object} options 配置选项
 * @param {boolean} [options.includeWeekend=false] - 是否包含周六/周日
 * @returns {{prop:string,label:string,dayOfWeek:number}[]} 周几数据数组
 */
export function buildWeekdays(options = {}) {
  const { includeWeekend = false } = options
  const base = [
    { prop: 'monday', label: '周一', value: 1 },
    { prop: 'tuesday', label: '周二', value: 2 },
    { prop: 'wednesday', label: '周三', value: 3 },
    { prop: 'thursday', label: '周四', value: 4 },
    { prop: 'friday', label: '周五', value: 5 }
  ]
  if (!includeWeekend) return base
  return [
    ...base,
    { prop: 'saturday', label: '周六', value: 6 },
    { prop: 'sunday', label: '周日', value: 7 }
  ]
}

/**
 * 根据当前周次和学期开始日期计算每日日期
 * @param {number} weekNumber 当前教学周

 * @returns {Array<{monthDay: string}>} 每日日期信息
 */
export function calculateDatesForWeek(weekNumber) {
  const start = new Date('2025-09-01')
  const weekStart = new Date(start.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000)

  // 找到本周的周一（weekStart可能是任何一天）
  const dayOfWeek = weekStart.getDay() // 0 (Sunday) to 6 (Saturday)
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // 周一为1，周日为-6
  const monday = new Date(weekStart)
  monday.setDate(monday.getDate() + mondayOffset)

  const dates = []
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday)
    currentDate.setDate(monday.getDate() + i)

    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')

    dates.push(
      `${month}-${day}` // MM-DD
    )
  }

  return dates
}

/**
 * 规范化特定教学周的原始课程数组
 * 如果提供了 weekNumber，则只保留包含该周的课程，并按天/节次聚合
 * @param {Array<Object>} rawCourses 原始课程数据数组
 * @param {Object} options 配置选项
 * @param {number} [options.weekNumber] - 教学周；如果提供，只保留包含该周的课程
 * @returns {Array<Object>} 规范化后的课程列表
 */
export function normalizeCourses(rawCourses, options = {}) {
  const { weekNumber } = options
  const filtered = weekNumber
    ? rawCourses.filter(item => Array.isArray(item.weeks) && item.weeks.includes(weekNumber))
    : rawCourses.slice()
  // 确保数据结构和派生属性
  return filtered.map(c => ({
    courseCode: c.courseCode,
    courseName: c.courseName,
    teacher: c.teacher,
    dayOfWeek: Number(c.dayOfWeek),
    startSection: Number(c.startSection),
    endSection: Number(c.endSection),
    classSections: Array.isArray(c.classSections) ? c.classSections.map(Number) : [],
    building: c.building,
    classroom: c.classroom,
    classroomType: c.classroomType,
    weekSchedule: c.weekSchedule,
    weeks: Array.isArray(c.weeks) ? c.weeks.slice() : [],
    courseTypeCode: c.courseTypeCode,
    courseTypeName: c.courseTypeName,
    credit: c.credit,
    totalHours: c.totalHours,
    examType: c.examType,
    courseNature: c.courseNature
  }))
}

/**
 * 获取按开始节次排序的今日课程
 * @param {Array<Object>} rawCourses 原始课程数据
 * @param {Object} options 配置选项
 * @param {number} [options.dayOfWeek] - 1..7；默认为当前日期(周日=7)
 * @returns {Array<Object>} 用于时间线/卡片的课程列表
 */
export function getTodayCourses(rawCourses, options = {}) {
  let { dayOfWeek } = options
  if (!dayOfWeek) {
    const jsDow = new Date().getDay() // 0..6，周日=0
    dayOfWeek = jsDow === 0 ? 7 : jsDow // 1..7
  }

  const weekNumber = getCurrentWeekNumber()

  const list = normalizeCourses(rawCourses, { weekNumber }).filter(c => c.dayOfWeek === dayOfWeek)
  list.sort((a, b) => a.startSection - b.startSection || a.endSection - b.endSection)

  const newList = list.map(item => ({
    classSections: item.classSections,
    classroom: item.classroom,
    courseName: item.courseName,
    teacher: item.teacher,
    startSection: item.startSection,
    endSection: item.endSection
  }))
  return newList
}

/**
 * 构建课程作息时间表
 * @param {Object} options 配置选项
 * @param {'summer'|'winter'} [options.season='summer'] - 季节类型，影响下午上课时间
 * @returns {Object} 节次->时间映射对象
 */
export function buildTimeSchedule(options = {}) {
  // 根据当前日期自动判断季节
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()

  // 夏令时: 5月6日 - 9月30日
  // 冬令时: 10月1日 - 次年5月5日
  const isSummer =
    (month > 5 && month < 10) || (month === 5 && day >= 6) || (month === 10 && day < 1)
  const { season = isSummer ? 'summer' : 'winter' } = options

  // 课程时间参数
  const CLASS_DURATION = 40
  const SHORT_BREAK = 5
  const LONG_BREAK = 15

  // 上课时间
  const MORNING_START = { hour: 8, minute: 0 }
  const AFTERNOON_START = season === 'summer' ? { hour: 14, minute: 0 } : { hour: 13, minute: 30 }
  const EVENING_START = { hour: 18, minute: 30 }

  const timeSlots = {}

  // 计算上午课程时间 (5节)
  let currentHour = MORNING_START.hour
  let currentMinute = MORNING_START.minute

  for (let i = 1; i <= 5; i++) {
    const startHour = String(currentHour).padStart(2, '0')
    const startMinute = String(currentMinute).padStart(2, '0')

    const endTotalMinutes = currentHour * 60 + currentMinute + CLASS_DURATION
    const endHour = Math.floor(endTotalMinutes / 60)
    const endMinute = endTotalMinutes % 60

    const endHourStr = String(endHour).padStart(2, '0')
    const endMinuteStr = String(endMinute).padStart(2, '0')

    timeSlots[i] = `${startHour}:${startMinute}\n${endHourStr}:${endMinuteStr}`

    // 更新下一节课的开始时间
    const breakTime = i === 4 ? SHORT_BREAK : i % 2 === 0 ? LONG_BREAK : SHORT_BREAK
    const nextTotalMinutes = endTotalMinutes + breakTime
    currentHour = Math.floor(nextTotalMinutes / 60)
    currentMinute = nextTotalMinutes % 60
  }

  // 计算下午课程时间 (4节)
  currentHour = AFTERNOON_START.hour
  currentMinute = AFTERNOON_START.minute

  for (let i = 6; i <= 9; i++) {
    const startHour = String(currentHour).padStart(2, '0')
    const startMinute = String(currentMinute).padStart(2, '0')

    const endTotalMinutes = currentHour * 60 + currentMinute + CLASS_DURATION
    const endHour = Math.floor(endTotalMinutes / 60)
    const endMinute = endTotalMinutes % 60

    const endHourStr = String(endHour).padStart(2, '0')
    const endMinuteStr = String(endMinute).padStart(2, '0')

    timeSlots[i] = `${startHour}:${startMinute}\n${endHourStr}:${endMinuteStr}`

    // 更新下一节课的开始时间
    const breakTime = (i - 5) % 2 === 0 ? LONG_BREAK : SHORT_BREAK
    const nextTotalMinutes = endTotalMinutes + breakTime
    currentHour = Math.floor(nextTotalMinutes / 60)
    currentMinute = nextTotalMinutes % 60
  }

  // 计算晚上课程时间 (3节)
  currentHour = EVENING_START.hour
  currentMinute = EVENING_START.minute

  for (let i = 10; i <= 12; i++) {
    const startHour = String(currentHour).padStart(2, '0')
    const startMinute = String(currentMinute).padStart(2, '0')

    const endTotalMinutes = currentHour * 60 + currentMinute + CLASS_DURATION
    const endHour = Math.floor(endTotalMinutes / 60)
    const endMinute = endTotalMinutes % 60

    const endHourStr = String(endHour).padStart(2, '0')
    const endMinuteStr = String(endMinute).padStart(2, '0')

    timeSlots[i] = `${startHour}:${startMinute}\n${endHourStr}:${endMinuteStr}`

    // 更新下一节课的开始时间
    const nextTotalMinutes = endTotalMinutes + SHORT_BREAK
    currentHour = Math.floor(nextTotalMinutes / 60)
    currentMinute = nextTotalMinutes % 60
  }

  return timeSlots
}

/**
 * 内置课程颜色方案 - 使用8位十六进制格式表示透明度
 */
export const COURSE_COLORS = [
  '#e9805b',
  '#a6c3ad',
  '#8aabd6',
  '#d4a2c9',
  '#9acbd6',
  '#e6b8a2',
  '#b39ddb',
  '#a5d6a7',
  '#ffcc80',
  '#f48fb1'
]

/**
 * 生成课程唯一标识符
 * @param {Object} course - 课程对象
 * @returns {string} 课程唯一标识符
 */
export function generateCourseId(course) {
  return `${course.courseName || ''}-${course.teacher || ''}-${course.classroom || ''}`
}

/**
 * 根据课程ID计算颜色索引
 * 使用稳定哈希算法确保相同课程始终获得相同颜色
 * @param {string} courseId - 课程唯一标识符
 * @param {number} colorCount - 颜色总数
 * @returns {number} 颜色索引
 */
export function getCourseColorIndex(courseId, colorCount) {
  // 使用课程ID生成稳定哈希值
  let hash = 0
  for (let i = 0; i < courseId.length; i++) {
    const char = courseId.charCodeAt(i)
    hash = (hash << 5) - hash + char
  }

  return Math.abs(hash) % colorCount
}

/**
 * 获取课程颜色配置
 * @param {Object} course - 课程对象
 * @param {Object} [options] - 配置选项
 * @param {boolean} [options.withOpacity=false] - 是否添加透明度（用于背景色）
 * @param {string} [options.opacity='36'] - 透明度值（十六进制，00-ff）
 * @returns {{backgroundColor: string, textColor: string}} 包含背景色和文字颜色的对象
 */
export function getCourseColors(course, options = {}) {
  const { withOpacity = false, opacity = '36' } = options

  const courseId = generateCourseId(course)
  const colorIndex = getCourseColorIndex(courseId, COURSE_COLORS.length)
  const baseColor = COURSE_COLORS[colorIndex]

  return {
    backgroundColor: withOpacity ? `${baseColor}${opacity}` : baseColor,
    textColor: baseColor
  }
}

/**
 * 构建表格用课程时间表
 * @param {Object} timeSlots - buildTimeSchedule函数的返回值
 * @returns {Array<{period: string, timeRange: string}>} 处理后的时间表数组
 */
export function buildTableTimeSchedule(timeSlots) {
  const result = []

  // 1-2节合并为1
  const lines1 = timeSlots[1].split('\n')
  const lines2 = timeSlots[2].split('\n')
  result.push({
    period: '1',
    timeRange: `${lines1[0]}\n${lines2[1]}`
  })

  // 3-4节合并为2
  const lines3 = timeSlots[3].split('\n')
  const lines4 = timeSlots[4].split('\n')
  result.push({
    period: '2',
    timeRange: `${lines3[0]}\n${lines4[1]}`
  })

  // 第5节为3
  result.push({
    period: '3',
    timeRange: timeSlots[5]
  })

  // 6-7节合并为4
  const lines6 = timeSlots[6].split('\n')
  const lines7 = timeSlots[7].split('\n')
  result.push({
    period: '4',
    timeRange: `${lines6[0]}\n${lines7[1]}`
  })

  // 8-9节合并为5
  const lines8 = timeSlots[8].split('\n')
  const lines9 = timeSlots[9].split('\n')
  result.push({
    period: '5',
    timeRange: `${lines8[0]}\n${lines9[1]}`
  })

  // 10,11,12节分别显示为6,7,8
  result.push({
    period: '6',
    timeRange: timeSlots[10]
  })

  result.push({
    period: '7',
    timeRange: timeSlots[11]
  })

  result.push({
    period: '8',
    timeRange: timeSlots[12]
  })

  return result
}

/**
 * 处理课程信息以构建表格所需的数据结构
 * @param {Array<Object>} rawCourses - 原始课程数据
 * @param {Object} options - 配置选项
 * @param {number} [options.weekNumber] - 指定周次，默认为当前周次
 * @returns {Array<Object>} 表格所需的数据结构
 */
export function buildScheduleTableData(rawCourses, options = {}) {
  const { weekNumber = getCurrentWeekNumber() } = options

  // 获取当前周的课程
  const weekCourses = normalizeCourses(rawCourses, { weekNumber })

  // 构建时间表
  const timeSlots = buildTimeSchedule()
  const tableTimeSchedule = buildTableTimeSchedule(timeSlots)

  // 构建星期映射
  const weekdayMap = {
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
    7: 'sunday'
  }

  // 初始化结果数组，基于时间表结构
  const result = tableTimeSchedule.map(timeSlot => ({
    period: timeSlot.period,
    timeRange: timeSlot.timeRange
  }))

  // 按照节次分组课程 (根据规则将节次分组)
  const sectionGroups = {
    1: [1, 2], // 第1组: 1-2节
    2: [3, 4], // 第2组: 3-4节
    3: [5], // 第3组: 5节
    4: [6, 7], // 第4组: 6-7节
    5: [8, 9], // 第5组: 8-9节
    6: [10], // 第6组: 10节
    7: [11], // 第7组: 11节
    8: [12] // 第8组: 12节
  }

  // 将课程按天和节次分组填充到结果中
  weekCourses.forEach(course => {
    const dayProp = weekdayMap[course.dayOfWeek]
    if (!dayProp) return

    // 查找这节课属于哪个节次分组（检查课程覆盖的所有节次）
    const courseSections = []
    for (let i = course.startSection; i <= course.endSection; i++) {
      courseSections.push(i)
    }

    // 查找包含课程任何节次的所有组
    const groupKeys = []
    for (const [key, sections] of Object.entries(sectionGroups)) {
      const intersect = courseSections.some(section => sections.includes(section))
      if (intersect) {
        groupKeys.push(key)
      }
    }

    // 为每个匹配的组添加课程信息
    groupKeys.forEach(groupKey => {
      // 在结果中找到对应的节次行
      const targetRow = result.find(row => row.period === String(groupKey))
      if (targetRow) {
        // 添加课程信息到对应天的列
        targetRow[dayProp] = {
          courseName: course.courseName,
          teacher: course.teacher,
          location: `${course.classroom || ''}`
        }
      }
    })
  })

  return mergeConsecutiveCourses(result)
}

/**
 * 合并连续时间段的相同课程
 * @param {Array} scheduleData - 课表数据
 * @param {Array} weekdays - 星期数据
 * @returns {Array} 合并后的课表数据
 */
function mergeConsecutiveCourses(scheduleData) {
  const weekdays = buildWeekdays()
  // 深拷贝课表数据，避免修改原数据
  const result = JSON.parse(JSON.stringify(scheduleData))

  // 需要检查的时间段对：1-2节和4-5节（对应period '1'和'2'，以及'4'和'5'）
  const periodPairs = [
    { first: '1', second: '2' }, // 1-2节
    { first: '4', second: '5' } // 4-5节
  ]

  periodPairs.forEach(pair => {
    const firstPeriodRow = result.find(row => row.period === pair.first)
    const secondPeriodRow = result.find(row => row.period === pair.second)

    // 如果两个时间段都存在
    if (firstPeriodRow && secondPeriodRow) {
      // 检查每一天是否需要合并课程
      weekdays.forEach(weekday => {
        const firstCourse = firstPeriodRow[weekday.prop]
        const secondCourse = secondPeriodRow[weekday.prop]

        // 只有当两个时间段都有课程且课程相同时才合并
        if (
          firstCourse &&
          secondCourse &&
          typeof firstCourse === 'object' &&
          typeof secondCourse === 'object' &&
          firstCourse.courseName === secondCourse.courseName &&
          firstCourse.teacher === secondCourse.teacher &&
          firstCourse.location === secondCourse.location
        ) {
          // 合并课程信息，添加rowspan标识
          firstPeriodRow[weekday.prop] = {
            ...firstCourse,
            rowspan: 2
          }

          // 清除第二个时间段的课程信息
          delete secondPeriodRow[weekday.prop]
        }
      })
    }
  })

  return result
}
